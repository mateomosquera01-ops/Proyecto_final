import { n8nService } from '../../integrations/n8n/n8n.service';
import { ApiError } from '../../shared/exceptions/ApiError';
import { LeadDTO } from './leads.entity';
import { leadsRepository } from './leads.repository';
import { CreateLeadInput } from './leads.validation';

function mapLeadToDTO(
  lead: {
    id: string;
    fullName: string;
    email: string;
    message: string;
    status: string;
    source: string;
    createdAt: Date;
    role: { name: string } | null;
    emailLogs?: { status: string }[];
  },
  dispatchedOverride?: boolean,
): LeadDTO {
  const latestEmailStatus = lead.emailLogs?.[0]?.status;
  return {
    id: lead.id,
    fullName: lead.fullName,
    email: lead.email,
    interestRole: lead.role?.name || 'BUYER',
    message: lead.message,
    status: lead.status,
    source: lead.source,
    catalogDispatched:
      dispatchedOverride !== undefined ? dispatchedOverride : latestEmailStatus === 'SENT',
    createdAt: lead.createdAt.toISOString(),
  };
}

export class LeadsService {
  async createLead(
    input: CreateLeadInput,
    meta: { ipAddress?: string; userAgent?: string },
  ): Promise<LeadDTO> {
    const role = await leadsRepository.findRoleByName(input.interestRole);
    const activeCatalog = await leadsRepository.findActiveCatalog();

    const lead = await leadsRepository.createLeadWithConsent({
      fullName: input.fullName,
      email: input.email,
      roleId: role?.id ?? null,
      message: input.message,
      consentGiven: input.consentGiven,
      policyVersion: input.policyVersion,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    const catalogTitle = activeCatalog?.title ?? 'Catálogo Textech 2026';
    const catalogPdfUrl = activeCatalog?.pdfUrl ?? null;

    const n8nResult = await n8nService.sendLeadCatalogWebhook({
      leadId: lead.id,
      fullName: lead.fullName,
      email: lead.email,
      interestRole: input.interestRole,
      message: lead.message,
      catalogTitle,
      catalogPdfUrl,
      requestedAt: lead.createdAt.toISOString(),
    });

    await leadsRepository.createEmailLog({
      leadId: lead.id,
      catalogId: activeCatalog?.id ?? null,
      recipientEmail: lead.email,
      subject: `Catálogo Digital Textech - ${catalogTitle}`,
      status: n8nResult.status,
      providerReference: n8nResult.providerReference,
      errorMessage: n8nResult.errorMessage,
      sentAt: n8nResult.dispatched ? new Date() : undefined,
    });

    return mapLeadToDTO(lead, n8nResult.dispatched);
  }

  async listLeads(): Promise<LeadDTO[]> {
    const leads = await leadsRepository.findAll();
    return leads.map((lead) => mapLeadToDTO(lead));
  }

  async updateLeadStatus(id: string, status: string): Promise<LeadDTO> {
    const existing = await leadsRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound('Lead no encontrado');
    }
    const updated = await leadsRepository.updateStatus(id, status);
    return mapLeadToDTO(updated);
  }

  async deleteLead(id: string): Promise<void> {
    const existing = await leadsRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound('Lead no encontrado');
    }
    await leadsRepository.deleteById(id);
  }
}

export const leadsService = new LeadsService();

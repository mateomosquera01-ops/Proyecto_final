import { prisma } from '../../config/database';

export class LeadsRepository {
  async findRoleByName(name: string) {
    return prisma.role.findUnique({ where: { name } });
  }

  async findActiveCatalog() {
    return prisma.catalog.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createLeadWithConsent(data: {
    fullName: string;
    email: string;
    roleId: string | null;
    message: string;
    consentGiven: boolean;
    policyVersion: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const lead = await tx.lead.create({
        data: {
          fullName: data.fullName,
          email: data.email.toLowerCase(),
          roleId: data.roleId,
          message: data.message,
          status: 'NEW',
          source: 'LANDING_FORM',
        },
        include: {
          role: true,
        },
      });

      await tx.consentLog.create({
        data: {
          leadId: lead.id,
          consentGiven: data.consentGiven,
          policyVersion: data.policyVersion,
          ipAddress: data.ipAddress?.slice(0, 64),
          userAgent: data.userAgent?.slice(0, 512),
        },
      });

      return lead;
    });
  }

  async createEmailLog(data: {
    leadId: string;
    catalogId: string | null;
    recipientEmail: string;
    subject: string;
    status: string;
    providerReference?: string;
    errorMessage?: string;
    sentAt?: Date;
  }) {
    return prisma.emailLog.create({
      data,
    });
  }

  async findAll() {
    return prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        role: true,
        emailLogs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.lead.findUnique({
      where: { id },
      include: {
        role: true,
        emailLogs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return prisma.lead.update({
      where: { id },
      data: { status },
      include: {
        role: true,
        emailLogs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  async deleteById(id: string) {
    return prisma.lead.delete({ where: { id } });
  }
}

export const leadsRepository = new LeadsRepository();

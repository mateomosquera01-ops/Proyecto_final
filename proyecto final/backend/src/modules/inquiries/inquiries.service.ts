import { ApiError } from '../../shared/exceptions/ApiError';
import { InquiryDTO } from './inquiries.entity';
import { inquiriesRepository } from './inquiries.repository';
import { CreateInquiryInput, UpdateInquiryStatusInput } from './inquiries.validation';

function mapInquiryToDTO(inquiry: {
  id: string;
  productId: string | null;
  contactName: string;
  contactEmail: string;
  quantity: number;
  notes: string;
  status: string;
  createdAt: Date;
  product: { name: string } | null;
}): InquiryDTO {
  return {
    id: inquiry.id,
    productId: inquiry.productId,
    productName: inquiry.product?.name ?? null,
    contactName: inquiry.contactName,
    contactEmail: inquiry.contactEmail,
    quantity: inquiry.quantity,
    notes: inquiry.notes,
    status: inquiry.status,
    createdAt: inquiry.createdAt.toISOString(),
  };
}

export class InquiriesService {
  async createInquiry(input: CreateInquiryInput, userId?: string): Promise<InquiryDTO> {
    const created = await inquiriesRepository.create({
      ...input,
      userId,
    });
    return mapInquiryToDTO(created);
  }

  async listInquiries(): Promise<InquiryDTO[]> {
    const inquiries = await inquiriesRepository.findAll();
    return inquiries.map(mapInquiryToDTO);
  }

  async updateStatus(
    id: string,
    input: UpdateInquiryStatusInput,
    changedBy?: string,
  ): Promise<InquiryDTO> {
    const existing = await inquiriesRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound('Consulta no encontrada');
    }
    const updated = await inquiriesRepository.updateStatus(
      id,
      existing.status,
      input.status,
      changedBy,
      input.comment,
    );
    return mapInquiryToDTO(updated);
  }
}

export const inquiriesService = new InquiriesService();

import { prisma } from '../../config/database';

export class InquiriesRepository {
  async create(data: {
    userId?: string;
    productId?: string;
    contactName: string;
    contactEmail: string;
    quantity: number;
    notes: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const inquiry = await tx.inquiry.create({
        data: {
          userId: data.userId ?? null,
          productId: data.productId ?? null,
          contactName: data.contactName,
          contactEmail: data.contactEmail.toLowerCase(),
          quantity: data.quantity,
          notes: data.notes,
          status: 'OPEN',
        },
        include: {
          product: true,
        },
      });

      await tx.inquiryHistory.create({
        data: {
          inquiryId: inquiry.id,
          changedBy: data.userId ?? null,
          oldStatus: null,
          newStatus: 'OPEN',
          comment: 'Consulta creada desde la plataforma Textech',
        },
      });

      return inquiry;
    });
  }

  async findAll() {
    return prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        product: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.inquiry.findUnique({
      where: { id },
      include: { product: true },
    });
  }

  async updateStatus(
    id: string,
    oldStatus: string,
    newStatus: string,
    changedBy?: string,
    comment?: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.inquiry.update({
        where: { id },
        data: { status: newStatus },
        include: { product: true },
      });

      await tx.inquiryHistory.create({
        data: {
          inquiryId: id,
          changedBy: changedBy ?? null,
          oldStatus,
          newStatus,
          comment: comment ?? `Estado actualizado a ${newStatus}`,
        },
      });

      return updated;
    });
  }
}

export const inquiriesRepository = new InquiriesRepository();

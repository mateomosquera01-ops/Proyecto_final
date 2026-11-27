export interface InquiryDTO {
  id: string;
  productId: string | null;
  productName: string | null;
  contactName: string;
  contactEmail: string;
  quantity: number;
  notes: string;
  status: string;
  createdAt: string;
}

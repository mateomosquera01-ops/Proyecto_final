export interface CatalogDTO {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  season: string | null;
  pdfUrl: string | null;
  isActive: boolean;
  productCount: number;
}

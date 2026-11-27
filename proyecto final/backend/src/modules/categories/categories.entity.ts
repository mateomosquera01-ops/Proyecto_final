export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
}

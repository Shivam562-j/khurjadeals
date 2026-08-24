export type ProductCondition = "new" | "used" | "refurbished";
export type ProductStatus    = "active" | "sold" | "inactive";

export interface Product {
  _id:          string;
  title:        string;
  slug:         string;
  description:  string;
  category:     string;
  condition:    ProductCondition;
  status:       ProductStatus;
  price:        number;
  images:       string[];
  location:     string;
  contactName:  string;
  contactPhone: string;
  isFeatured:   boolean;
  views:        number;
  createdAt:    string;
  updatedAt:    string;
}

export interface ProductFilter {
  category?:  string | string[];
  condition?: ProductCondition | ProductCondition[];
  minPrice?:  number;
  maxPrice?:  number;
  location?:  string;
  search?:    string;
  page?:      number;
  limit?:     number;
  cursor?:    string;
}

export interface PaginatedProductResponse {
  products: Product[];
  total?: number;
  page?: number;
  limit: number;
  totalPages?: number;
  nextCursor?: string | null;
  nextPage?: number | null;
  hasMore: boolean;
}

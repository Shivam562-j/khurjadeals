export type QueryType   = "property" | "product" | "general";
export type QueryStatus = "pending" | "contacted" | "resolved" | "closed";

export interface Query {
  _id:         string;
  name:        string;
  phone:       string;
  email?:      string;
  type:        QueryType;
  message:     string;
  status:      QueryStatus;
  referenceId?: string; // property or product _id if applicable
  createdAt:   string;
  updatedAt:   string;
}

export interface QueryFilter {
  type?:      QueryType | QueryType[] | string;
  status?:    QueryStatus | QueryStatus[] | string;
  search?:    string;
  sortBy?:    string;
  sortOrder?: "asc" | "desc" | boolean | string;
  page?:      number;
  limit?:     number;
}

export interface PaginatedQueryResponse {
  queries: Query[];
  total?: number;
  count?: number;
  page?: number;
  limit: number;
  totalPages?: number;
  hasMore?: boolean;
}

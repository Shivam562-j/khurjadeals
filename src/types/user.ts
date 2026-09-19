export type UserRole   = "admin" | "moderator";
export type UserStatus = "active" | "inactive";

export interface User {
  _id:       string;
  name:      string;
  email:     string;
  password?: string; // omitted in responses
  role:      UserRole;
  status:    UserStatus;
  avatar?:   string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  imageUrl?: string;
}

export interface UserFilter {
  role?:      UserRole | UserRole[] | string;
  status?:    UserStatus | UserStatus[] | string;
  search?:    string;
  sortBy?:    string;
  sortOrder?: "asc" | "desc" | boolean | string;
  page?:      number;
  limit?:     number;
}

export interface PaginatedUserResponse {
  users: User[];
  total?: number;
  count?: number;
  page?: number;
  limit: number;
  totalPages?: number;
  hasMore?: boolean;
}

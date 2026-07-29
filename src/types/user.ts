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
  id:    string;
  name:  string;
  email: string;
  role:  UserRole;
}

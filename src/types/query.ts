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

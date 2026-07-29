export type PropertyType = "residential" | "commercial" | "plot" | "agricultural";
export type ListingType  = "sell" | "rent" | "lease";
export type PropertyStatus = "active" | "sold" | "rented" | "inactive";

export interface Property {
  _id:          string;
  title:        string;
  slug:         string;
  description:  string;
  type:         PropertyType;
  listingType:  ListingType;
  status:       PropertyStatus;
  price:        number;
  area:         number; // sq ft
  areaUnit:     "sqft" | "sqyd" | "acre" | "bigha";
  location:     string;
  address:      string;
  images:       string[];
  features:     string[];
  contactName:  string;
  contactPhone: string;
  isFeatured:   boolean;
  views:        number;
  createdAt:    string;
  updatedAt:    string;
}

export interface PropertyFilter {
  type?:        PropertyType;
  listingType?: ListingType;
  minPrice?:    number;
  maxPrice?:    number;
  location?:    string;
  search?:      string;
  page?:        number;
  limit?:       number;
}

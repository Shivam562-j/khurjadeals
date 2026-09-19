"use client";

import { postRequest, getRequest, deleteRequest, putRequest } from "./apiClient";

export const Api = {
  logout: () => postRequest("/api/auth/logout", {}, true),

  // Properties
  getAllProperties: (params?: any) => getRequest("/api/properties", params),
  getPropertyById: (id: string) => getRequest(`/api/properties/${id}`),
  createProperty: (data: any) => postRequest("/api/properties", data),
  updateProperty: (id: string, data: any) => putRequest(`/api/properties/${id}`, data),
  deleteProperty: (id: string) => deleteRequest(`/api/properties/${id}`),

  // Products
  getAllProducts: (params?: any) => getRequest("/api/products", params),
  getProductById: (id: string) => getRequest(`/api/products/${id}`),
  createProduct: (data: any) => postRequest("/api/products", data),
  updateProduct: (id: string, data: any) => putRequest(`/api/products/${id}`, data),
  deleteProduct: (id: string) => deleteRequest(`/api/products/${id}`),

  // Customer Queries
  getAllQueries: (params?: any) => getRequest("/api/queries", params),
  updateQuery: (id: string, data: any) => putRequest(`/api/queries/${id}`, data),
  deleteQuery: (id: string) => deleteRequest(`/api/queries/${id}`),

  // Administrators / Users
  getAllUsers: (params?: any) => getRequest("/api/users", params),
  createUser: (data: any) => postRequest("/api/users", data),
  updateUser: (id: string, data: any) => putRequest(`/api/users/${id}`, data),
  deleteUser: (id: string) => deleteRequest(`/api/users/${id}`),
};

export default Api;

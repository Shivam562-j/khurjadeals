"use client";

import axios from "axios";
import { toast } from "react-toastify";

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || "";
  }
  return "";
};

export const ErrorHandler = (e: any, isToastError = true) => {
  const msg =
    e?.response?.data?.message ||
    e?.message ||
    "An unexpected error occurred. Please try again.";
  if (isToastError) {
    toast.error(msg);
  }
  console.error("API Error:", e);
};

export const apiClient = axios.create({
  baseURL: "",
  withCredentials: true,
});

export const postRequest = async (
  endpoint: string,
  data: any = {},
  isHeader = false,
  header: Record<string, any> = {},
  isToastError = true
) => {
  return apiClient
    .post(endpoint, data, {
      headers: isHeader
        ? {
            ...header,
            Authorization: `Bearer ${getToken()}`,
          }
        : header,
      withCredentials: true,
    })
    .then((res) => {
      if (res.status === 200 || res.status === 201) {
        return res;
      }
      return res;
    })
    .catch(async (e) => {
      ErrorHandler(e, isToastError);
      return e;
    });
};

export const getRequest = async (
  endpoint: string,
  params: any = {},
  isHeader = false,
  header: Record<string, any> = {},
  isToastError = true
) => {
  return apiClient
    .get(endpoint, {
      params,
      headers: isHeader
        ? {
            ...header,
            Authorization: `Bearer ${getToken()}`,
          }
        : header,
      withCredentials: true,
    })
    .then((res) => {
      if (res.status === 200) {
        return res;
      }
      return res;
    })
    .catch(async (e) => {
      ErrorHandler(e, isToastError);
      return e;
    });
};

export const deleteRequest = async (
  endpoint: string,
  data: any = {},
  isHeader = false,
  header: Record<string, any> = {},
  isToastError = true
) => {
  return apiClient
    .delete(endpoint, {
      data,
      headers: isHeader
        ? {
            ...header,
            Authorization: `Bearer ${getToken()}`,
          }
        : header,
      withCredentials: true,
    })
    .then((res) => {
      if (res.status === 200) {
        return res;
      }
      return res;
    })
    .catch(async (e) => {
      ErrorHandler(e, isToastError);
      return e;
    });
};

export const putRequest = async (
  endpoint: string,
  data: any = {},
  isHeader = false,
  header: Record<string, any> = {},
  isToastError = true
) => {
  return apiClient
    .put(endpoint, data, {
      headers: isHeader
        ? {
            ...header,
            Authorization: `Bearer ${getToken()}`,
          }
        : header,
      withCredentials: true,
    })
    .then((res) => {
      if (res.status === 200) {
        return res;
      }
      return res;
    })
    .catch(async (e) => {
      ErrorHandler(e, isToastError);
      return e;
    });
};

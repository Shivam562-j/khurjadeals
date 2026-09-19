"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer, ToastOptions, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// SVG Rounded Icons matching Material UI CheckCircleRounded, ErrorRounded, and WarningRounded
const CheckCircleRounded = ({ style }: { style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ width: "22px", height: "22px", flexShrink: 0, ...style }}
    aria-hidden="true"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const ErrorRounded = ({ style }: { style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ width: "22px", height: "22px", flexShrink: 0, ...style }}
    aria-hidden="true"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </svg>
);

const WarningRounded = ({ style, sx }: { style?: React.CSSProperties; sx?: { color?: string } }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ width: "22px", height: "22px", flexShrink: 0, color: sx?.color || style?.color || "#d51d10", ...style }}
    aria-hidden="true"
  >
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
  </svg>
);

// Make toast available globally on window for client testing / console debugging
if (typeof window !== "undefined") {
  (window as any).toast = toast;
}

/**
 * Standard Admin Toast wrapper matching react-toastify methods
 */
export const adminToast = toast;
export { toast };

/**
 * Exact ToastContainer configuration as provided by the user:
 * - position="top-center"
 * - autoClose={3000}
 * - hideProgressBar={true}
 * - closeOnClick={true}
 * - icon: success (#006c4d), error (#d51d10), warning (#d51d10)
 * - toastClassName:
 *     success -> bg-[#daf5ed] text-[#006c4d] flex justify-between items-center p-2 rounded text-sm font-semibold
 *     error   -> bg-[#fde9e7] text-[#d51d10] flex justify-between items-center p-2 rounded text-sm font-semibold
 *     warning -> bg-[#fde9e7] text-[#d51d10] flex justify-between items-center p-2 rounded text-sm font-semibold
 * - closeButton={false}
 * - pauseOnHover={true}
 * - draggable={false}
 * - theme="light"
 * - transition={Slide}
 */
export function AdminToaster() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      (window as any).toast = toast;
    }
  }, []);

  if (!mounted) return null;

  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={true}
      closeOnClick={true}
      icon={({ type }) =>
        type === "success" ? (
          <CheckCircleRounded style={{ color: "#006c4d" }} />
        ) : type === "error" ? (
          <ErrorRounded style={{ color: "#d51d10" }} />
        ) : type === "warning" ? (
          <WarningRounded sx={{ color: "d51d10" }} />
        ) : (
          <WarningRounded sx={{ color: "d51d10" }} />
        )
      }
      toastClassName={(context) =>
        context?.type === "success"
          ? "bg-[#daf5ed] text-[#006c4d] flex justify-between items-center p-2 rounded text-sm font-semibold cursor-pointer border border-[#bbf0df]"
          : context?.type === "error"
          ? "bg-[#fde9e7] text-[#d51d10] flex justify-between items-center p-2 rounded text-sm font-semibold cursor-pointer border border-[#fad4d0]"
          : "bg-[#fde9e7] text-[#d51d10] flex justify-between items-center p-2 rounded text-sm font-semibold cursor-pointer border border-[#fad4d0]"
      }
      closeButton={false}
      pauseOnHover={true}
      draggable={false}
      theme="light"
      transition={Slide}
      style={{
        zIndex: 99999999,
        top: "14px",
      }}
    />
  );
}

export default toast;

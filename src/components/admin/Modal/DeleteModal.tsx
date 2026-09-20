"use client";

import React, { useEffect } from "react";
import CustomModalHeader from "./CustomModalHeader";

export interface DeleteModalProps {
  isConfirm?: boolean;
  deleteOpenModal: boolean;
  headerTitle?: string;
  deleteTextname?: string;
  handleDeleteClick: () => void | Promise<void>;
  handleCloseClick: () => void;
  rowLength?: number;
  mutliDeleteText?: React.ReactNode;
  loading?: boolean;
}

export default function DeleteModal({
  isConfirm = false,
  deleteOpenModal = false,
  headerTitle = "Property",
  deleteTextname = "",
  handleDeleteClick,
  handleCloseClick,
  rowLength,
  mutliDeleteText,
  loading = false,
}: DeleteModalProps) {
  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && deleteOpenModal && !loading) {
        handleCloseClick();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteOpenModal, handleCloseClick, loading]);

  // Lock body scroll
  useEffect(() => {
    if (deleteOpenModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [deleteOpenModal]);

  if (!deleteOpenModal) return null;

  const defaultMultiText = (
    <>
      <p>
        Are you sure you want to delete the selected{" "}
        <b className="font-semibold">{rowLength} properties</b>?
      </p>
      <p className="text-xs text-[#555E6F]">
        Note: This action is permanent and cannot be undone.
      </p>
    </>
  );

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* ── BACKDROP OVERLAY ── */}
      <div
        onClick={() => !loading && handleCloseClick()}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
      />

      {/* ── MODAL CONTAINER ── */}
      <div
        className="relative z-10 w-full max-w-[560px] min-h-[180px] max-h-[85vh] bg-[#171717] rounded-xl shadow-2xl border border-[#2e2e2e] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Heading */}
        <CustomModalHeader
          headerTitle={isConfirm ? "Confirm Delete" : `Delete ${headerTitle}`}
          handleCloseModal={() => !loading && handleCloseClick()}
        />

        {/* Delete Modal Content */}
        <div className="p-5 sm:p-6 flex flex-col gap-3 overflow-y-auto text-sm font-normal leading-relaxed text-[#e5e5e5]">
          {rowLength && rowLength > 0 ? (
            <div className="flex flex-col gap-1">
              {mutliDeleteText || (
                <>
                  <p>
                    Are you sure you want to delete the selected{" "}
                    <b className="font-semibold text-white">{rowLength} {headerTitle?.toLowerCase() || "items"}</b>?
                  </p>
                  <p className="text-xs text-[#a3a3a3]">
                    Note: This action is permanent and cannot be undone.
                  </p>
                </>
              )}
            </div>
          ) : (
            <p>
              Are you sure you want to delete{" "}
              <b className="font-semibold text-white">
                {deleteTextname || "this item"}
              </b>
              ? This action cannot be undone.
            </p>
          )}
        </div>

        {/* Form Footer */}
        <div className="p-4 px-6 border-t border-[#262626] flex items-center gap-3 w-full justify-end bg-[#141414]">
          <button
            type="button"
            disabled={loading}
            onClick={handleCloseClick}
            className="px-4 py-2 rounded-lg bg-[#1f1f1f] border border-[#333333] text-[#e5e5e5] hover:bg-[#262626] hover:text-white transition-colors text-sm font-medium cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleDeleteClick}
            className="px-4 py-2 rounded-lg bg-[#d51d10] border border-[#d51d10] text-white hover:bg-[#ef362a] transition-colors text-sm font-semibold cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { FaRegFrown } from "react-icons/fa";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = "No results found",
  description = "We couldn't find anything matching your search filters. Try adjusting your parameters.",
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="empty-state-box">
      <div className="empty-state-icon-wrapper">
        <FaRegFrown style={{ fontSize: "24px" }} />
      </div>

      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>

      {actionText && onAction && (
        <button type="button" onClick={onAction} className="empty-state-reset-btn">
          {actionText}
        </button>
      )}
    </div>
  );
}


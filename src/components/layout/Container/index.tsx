import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Thin wrapper that applies the `.container` utility class from globals.css.
 * max-width: 1200px, centered, 0 24px padding.
 */
export default function Container({
  children,
  className = "",
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component className={`container ${className}`.trim()}>
      {children}
    </Component>
  );
}

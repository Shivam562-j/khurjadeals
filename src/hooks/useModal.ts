"use client";
import { useState, useCallback } from "react";

export function useModal(initial: boolean = false) {
  const [isOpen, setIsOpen] = useState(initial);

  const open  = useCallback(() => setIsOpen(true),  []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((o) => !o), []);

  return { isOpen, open, close, toggle };
}

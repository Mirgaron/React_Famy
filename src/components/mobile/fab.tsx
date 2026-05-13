"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FABProps {
  onClick: () => void;
  icon?: ReactNode;
}

export function FAB({ onClick, icon }: FABProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      onClick={onClick}
      className="fixed bottom-24 right-4 bg-ios-accent rounded-full flex items-center justify-center z-40"
      style={{
        width: 56,
        height: 56,
        minWidth: 56,
        minHeight: 56,
        boxShadow: "var(--shadow-fab)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      aria-label="Agregar"
    >
      {icon || (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      )}
    </motion.button>
  );
}
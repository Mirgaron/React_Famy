"use client";

import { useEffect, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  height?: "50%" | "60%" | "70%" | "85%" | "90%" | "95%";
}

const heightClass = {
  "50%": "min-h-[50vh] h-auto",
  "60%": "min-h-[60vh] h-auto",
  "70%": "min-h-[70vh] h-auto",
  "85%": "min-h-[85vh] h-auto",
  "90%": "min-h-[90vh] h-auto",
  "95%": "min-h-[95vh] h-auto",
};

export function BottomSheet({ isOpen, onClose, title, children, height = "60%" }: BottomSheetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            className={`fixed bottom-0 left-0 right-0 ${heightClass[height]} bg-ios-bg-primary rounded-t-2xl z-50`}
            style={{
              paddingBottom: "env(safe-area-inset-bottom)",
              boxShadow: "var(--shadow-sheet)",
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center py-3 cursor-grab active:cursor-grabbing">
              <div className="w-9 h-1 bg-ios-bg-tertiary rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4 border-b border-ios-bg-tertiary">
              <h2 className="text-lg font-semibold text-ios-text-primary">{title}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-ios-bg-secondary flex items-center justify-center active:opacity-70"
                style={{ minHeight: 44, minWidth: 44 }}
              >
                <svg className="w-5 h-5 text-ios-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
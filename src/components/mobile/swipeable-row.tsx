"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { ReactNode } from "react";

interface SwipeableRowProps {
  children: ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  confirmDeleteText?: string;
}

const SWIPE_THRESHOLD = 80;
const AUTO_TRIGGER_THRESHOLD = 160;

export function SwipeableRow({
  children,
  onEdit,
  onDelete,
  confirmDeleteText = "¿Eliminar?",
}: SwipeableRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const x = useMotionValue(0);

  const leftActionOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);
  const rightActionOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const offsetX = info.offset.x;

    if (offsetX < -AUTO_TRIGGER_THRESHOLD && onDelete) {
      setShowConfirm(true);
    } else if (offsetX > AUTO_TRIGGER_THRESHOLD && onEdit) {
      onEdit();
    }
  };

  const handleDeleteConfirm = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete?.();
    }, 300);
  };

  if (isDeleting) {
    return (
      <motion.div
        initial={{ opacity: 1, x: 0 }}
        animate={{ opacity: 0, x: "-100%" }}
        transition={{ duration: 0.3, ease: "easeIn" }}
        className="w-full"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Left action (edit) */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-20 bg-ios-accent flex items-center justify-center"
        style={{ opacity: rightActionOpacity }}
      >
        <button
          onClick={onEdit}
          className="w-full h-full flex items-center justify-center active:opacity-70"
          style={{ minHeight: 44 }}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </motion.div>

      {/* Right action (delete) */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-20 bg-ios-danger flex items-center justify-center"
        style={{ opacity: leftActionOpacity }}
      >
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full h-full flex items-center justify-center active:opacity-70"
          style={{ minHeight: 44 }}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </motion.div>

      {/* Confirm overlay */}
      {showConfirm && (
        <div className="absolute inset-0 bg-ios-danger z-10 flex items-center justify-around px-4">
          <span className="text-white font-semibold text-sm">{confirmDeleteText}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-2 bg-white/20 rounded-lg text-white text-sm font-medium active:opacity-70"
              style={{ minHeight: 36, minWidth: 60 }}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-3 py-2 bg-white rounded-lg text-ios-danger text-sm font-semibold active:opacity-70"
              style={{ minHeight: 36, minWidth: 70 }}
            >
              Eliminar
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 120 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        onClick={() => onEdit?.()}
        style={{ x }}
        className="bg-ios-bg-primary relative cursor-pointer"
      >
        {children}
      </motion.div>
    </div>
  );
}
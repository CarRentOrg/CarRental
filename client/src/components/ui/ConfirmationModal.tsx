"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { AlertCircle, CheckCircle, X, HelpCircle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "default" | "danger" | "success" | "warning";
  isLoading?: boolean;
  children?: React.ReactNode;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default",
  isLoading = false,
  children,
}: ConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        if (!isLoading) onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Lock body scroll
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, isLoading]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, isLoading]);

  // Styling based on type
  const getIcon = () => {
    switch (type) {
      case "danger":
        return <AlertCircle className="h-6 w-6 text-red-600" />;
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "warning":
        return <AlertCircle className="h-6 w-6 text-amber-600" />;
      default:
        return <HelpCircle className="h-6 w-6 text-blue-600" />;
    }
  };

  const getButtonStyles = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white shadow-red-200";
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white shadow-green-200";
      case "warning":
        return "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200";
      default:
        return "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200";
    }
  };

  const getIconBg = () => {
    switch (type) {
      case "danger":
        return "bg-red-50";
      case "success":
        return "bg-green-50";
      case "warning":
        return "bg-amber-50";
      default:
        return "bg-blue-50";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 md:p-8"
          >
            {/* Close Button */}
            {!isLoading && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}

            <div className="flex flex-col items-center text-center">
              <div
                className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 ${getIconBg()}`}
              >
                {getIcon()}
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>

              <p className="text-gray-500 mb-6 font-medium leading-relaxed">
                {message}
              </p>

              {children && (
                <div className="w-full mb-6 text-left">{children}</div>
              )}

              <div className="flex gap-3 w-full">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center justify-center disabled:opacity-70 ${getButtonStyles()}`}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

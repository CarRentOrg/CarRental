"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Info, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "info";
  isLoading?: boolean;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info",
  isLoading = false,
}: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    type === "danger"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-blue-500/10 text-blue-500"
                  }`}
                >
                  {type === "danger" ? (
                    <AlertCircle className="h-6 w-6" />
                  ) : (
                    <Info className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">{title}</h2>
                  <p className="text-zinc-500 text-sm">{message}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 py-4 bg-white/5 text-zinc-400 hover:text-white rounded-2xl font-bold transition-all disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] disabled:opacity-50 ${
                    type === "danger"
                      ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/10"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/10"
                  }`}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;

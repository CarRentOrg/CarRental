"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car } from "lucide-react";
import { useLoading } from "@/contexts/LoadingContext";

export default function FullPageLoader() {
  const { isLoading } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <div className="h-24 w-24 rounded-full border-4 border-blue-600/30 border-t-blue-500 animate-spin absolute inset-0" />
            <div className="h-24 w-24 flex items-center justify-center">
              <Car className="h-10 w-10 text-white" />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-blue-500 font-bold tracking-widest uppercase text-sm"
          >
            Системийг ачаалж байна…
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

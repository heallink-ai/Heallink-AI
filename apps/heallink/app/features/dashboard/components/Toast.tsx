"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ToastProps } from "../types";

const Toast = ({
  message,
  isVisible,
  type = "info",
}: ToastProps) => {
  const bgColor =
    type === "success"
      ? "bg-green-600"
      : type === "error"
        ? "bg-red-600"
        : "bg-primary";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg z-50`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
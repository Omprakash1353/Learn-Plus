"use client";

import { toast } from "sonner";
import clsx from "clsx";

type ToastMessageProps = {
  message: string;
  type?: "default" | "success" | "error";
  className?: string;
};

export function ToastMessage({
  message,
  type = "default",
  className = "",
}: ToastMessageProps) {
  const baseClasses = "border-none shadow-lg";

  const typeClasses = {
    success: "bg-emerald-500 text-white",
    error: "bg-red-700 text-white",
    default: "",
  };

  toast(message, {
    className: clsx(typeClasses[type], baseClasses, className),
  });
}

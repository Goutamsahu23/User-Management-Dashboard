// src/components/ui/Button.tsx
"use client";
import React from "react";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
};

export default function Button({
  variant = "primary",
  leftIcon,
  rightIcon,
  size = "md",
  className,
  children,
  ...rest
}: Props) {
  const sizeMap: Record<string, string> = {
    sm: "text-sm px-2 py-1",
    md: "text-sm px-3 py-2",
    lg: "text-base px-4 py-2",
  };

  const variantCls: Record<string, string> = {
    primary: "btn btn-primary",
    ghost: "btn btn-ghost",
    danger: "btn btn-danger",
  };

  return (
    <button
      {...rest}
      className={clsx(variantCls[variant], sizeMap[size], className)}
    >
      {leftIcon && <span className="flex items-center">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </button>
  );
}

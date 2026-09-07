import React from "react";

interface LogoProps {
  className?: string;
  variant?: "dark" | "light" | "colored";
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", variant = "dark", size = "md" }: LogoProps) {
  const iconSizes = {
    sm: "w-6 h-5",
    md: "w-8 h-6",
    lg: "w-9 h-7",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  // Website uses dark teal/petrol (var(--eh-text,#1c2129)) for text and terracotta (var(--eh-terra,#c8623a)) for accents
  const isLight = variant === "light";

  return (
    <div
      id="einfachhausen-brand-logo"
      className={`inline-flex items-center gap-2 font-bold tracking-tight select-none ${className}`}
    >
      {/* Modern architectural double-gable roof silhouette */}
      <svg
        viewBox="0 0 38 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSizes[size]} shrink-0 transition-transform duration-200 hover:scale-105`}
        aria-hidden="true"
      >
        <path
          d="M2 17L13.5 5L24.5 15.5L34.5 7"
          stroke={isLight ? "#E69E66" : "var(--eh-terra,#c8623a)"}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 21H31"
          stroke={isLight ? "rgba(255, 255, 255, 0.45)" : "var(--eh-text,#1c2129)"}
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity={isLight ? "0.6" : "0.35"}
        />
      </svg>

      <span className={`${textSizes[size]} font-medium tracking-tight ${isLight ? "text-white" : "text-[var(--eh-text,#1c2129)]"}`}>
        einfach<span className={isLight ? "text-[#E69E66] font-bold" : "text-[var(--eh-text,#1c2129)] font-bold"}>hausen</span>
      </span>
    </div>
  );
}

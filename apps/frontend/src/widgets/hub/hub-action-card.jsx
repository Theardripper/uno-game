import React from "react";
import { cn } from "@/helpers/cn";

export function HubActionCard({ icon: Icon, title, description, colorClass, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex flex-col items-center justify-center p-8 rounded-[32px] border border-white/5 bg-[#2A1B19] hover:bg-[#32201d] transition-all w-full max-w-[320px] aspect-square",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className={cn(
        "w-16 h-16 rounded-full border-2 flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
        colorClass
      )}>
        <Icon className="w-6 h-6 fill-current" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/50 text-center max-w-[200px] leading-tight">
        {description}
      </p>
    </button>
  );
}

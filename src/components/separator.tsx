import React from "react";
import { clsx } from "clsx";

interface SeparatorProps {
  text?: string;
  className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({ text, className }) => {
  return (
    <div className={clsx("relative w-full", className)}>
      <div className="flex items-center">
        <div
          className={clsx(
            "h-px flex-grow",
            "bg-gradient-to-r from-[#33333303] to-[#333333BF] dark:from-[#FFFFFF03] dark:to-[#FFFFFFBF]"
          )}
        />

        {text && (
          <span className={`transform mx-2 text-sm text-center text-default-700`}>{text}</span>
        )}
        <div
          className={clsx(
            "h-px flex-grow",
            "bg-gradient-to-r from-[#333333BF] to-[#33333303] dark:from-[#FFFFFFBF] dark:to-[#FFFFFF03]"
          )}
        />
      </div>
    </div>
  );
};

export default Separator;

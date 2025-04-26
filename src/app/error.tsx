"use client";

import { Button } from "@heroui/button";
import { useTheme } from "next-themes";
import { useEffect } from "react";

import { ThemeSwitch } from "@/components/theme-switch";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <ThemeSwitch className="absolute top-4 right-4 p-2 border border-neutral-400 shadow-sm bg-neutral-100 dark:bg-neutral-900/50 rounded-2xl" />
      <div
        className={`flex min-h-screen flex-col items-center justify-center text-center px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 ${isDark ? "bg-default-50 text-default-900" : "bg-default-100 text-default-800"}`}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-500">
          Oops! Something went wrong
        </h2>
        <p className="mt-4 text-base sm:text-lg md:text-xl text-default-600">
          We encountered an unexpected error. Please try again.
        </p>
        <Button
          className="mt-6 font-medium"
          color="primary"
          variant="faded"
          onPress={() =>
            // Attempt to recover by trying to re-render the segment
            reset()
          }
        >
          Try Again
        </Button>
      </div>
    </>
  );
}

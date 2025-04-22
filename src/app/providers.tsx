"use client";

import type { ThemeProviderProps } from "next-themes";

import React, { useEffect, useState, useMemo } from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";

import { store } from "@/store";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const navigate = useMemo(() => router.push, [router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <HeroUIProvider navigate={navigate}>
      <NextThemesProvider attribute="class" defaultTheme="light" {...themeProps}>
      <Provider store={store}>
        {children}
      </Provider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}

import React, { FunctionComponent, Suspense } from "react";
import BeatLoader from "react-spinners/BeatLoader";

import { ThemeSwitch } from "@/components/theme-switch";

interface Props {
  children: React.ReactNode;
}

const DashboardLayout: FunctionComponent<Props> = ({ children }) => {
  return (
    <div className="flex flex-col bg-neutral-100 dark:bg-neutral-900/50 w-full min-h-screen justify-center items-center">
      <ThemeSwitch className="absolute top-4 right-4 p-2 border border-neutral-400 shadow-sm bg-neutral-100 dark:bg-black rounded-2xl" />
      <Suspense fallback={<BeatLoader color="#ff7849" size={15} />}>{children}</Suspense>
    </div>
  );
};

export default DashboardLayout;

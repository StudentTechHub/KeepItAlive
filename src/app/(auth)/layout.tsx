import React, { FunctionComponent, Suspense } from "react";
import BeatLoader from "react-spinners/BeatLoader";

import { ThemeSwitch } from "@/components/theme-switch";

interface Props {
  children: React.ReactNode;
}

const AuthLayout: FunctionComponent<Props> = ({ children }) => {
  return (
    <div className="flex flex-col bg-auth-vector dark:bg-auth-vector-dark bg-no-repeat bg-cover bg-default-100 w-full h-screen justify-center items-center">
      <ThemeSwitch className="absolute top-4 right-4 p-2 border border-neutral-400 shadow-sm bg-neutral-100 dark:bg-neutral-900/50 rounded-2xl" />
      <Suspense fallback={<BeatLoader color="#ff7849" size={15} />}>
        <div className="py-7 px-6 h-auto sm:w-[400px] w-80 max-w-xl bg-default-50/75 rounded-2xl">
          {children}
        </div>
      </Suspense>
    </div>
  );
};

export default AuthLayout;

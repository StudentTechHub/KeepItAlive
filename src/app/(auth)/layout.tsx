import React, { FunctionComponent, Suspense } from "react";
import BeatLoader from "react-spinners/BeatLoader";

interface Props {
  children: React.ReactNode;
}

const AuthLayout: FunctionComponent<Props> = ({ children }) => {
  return (
    <div className="flex flex-col bg-auth-vector dark:bg-auth-vector-dark bg-no-repeat bg-cover bg-default-100 h-screen justify-center items-center">
      <Suspense fallback={<BeatLoader color="#ff7849" size={15} />}>
        <div className="py-7 px-6 h-auto sm:w-[400px] w-80 max-w-xl bg-default-50/75 rounded-2xl">
          {children}
        </div>
      </Suspense>
    </div>
  );
};

export default AuthLayout;

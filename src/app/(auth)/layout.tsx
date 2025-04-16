import React, { FunctionComponent, Suspense } from "react";
import BeatLoader from "react-spinners/BeatLoader";

interface Props {
  children: React.ReactNode;
}

const AuthLayout: FunctionComponent<Props> = ({ children }) => {
  return <Suspense fallback={<BeatLoader size={12} />}>{children}</Suspense>;
};

export default AuthLayout;

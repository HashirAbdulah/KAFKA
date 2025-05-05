import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import LoadingSpinner from "../components/ui/LoadingSpinner";

// Dynamic imports for modals
export const LoginModal = dynamic(
  () => import("../components/modals/LoginModal"),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const SignupModal = dynamic(
  () => import("../components/modals/SignupModal"),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const AddPropertyModal = dynamic(
  () => import("../components/modals/AddPropertyModal"),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const SearchModal = dynamic(
  () => import("../components/modals/SearchModal"),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const EditPropertyModal = dynamic(
  () => import("../components/modals/EditPropertyModal"),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

// Wrapper component for Suspense
export const withSuspense = (Component: React.ComponentType) => {
  return (props: any) => (
    <Suspense fallback={<LoadingSpinner />}>
      <Component {...props} />
    </Suspense>
  );
};

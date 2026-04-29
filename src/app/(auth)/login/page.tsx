import { Suspense } from "react";
import LoginForm from "@/features/auth/login";
import { LoginSkeleton } from "@/features/auth/login-skeleton";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

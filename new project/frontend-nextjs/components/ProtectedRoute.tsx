import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string;
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    if (role && user.role !== role) {
      router.push("/dashboard");
    }
  }, [user, role, router]);

  if (!user) {
    return null;
  }

  if (role && user.role !== role) {
    return null;
  }

  return <>{children}</>;
}
import { useGetLoggedUserQuery } from "@/services/userApi";
import { redirect, useRouter } from "next/navigation";

export const useAuth = () => {
  const { push } = useRouter();

  const {
    data: user,
    isLoading,
    isUninitialized,
  } = useGetLoggedUserQuery(null);

  const isAuthenticated = !!user;
  const userRole = user?.profile || "";

  const redirectToLogin = () => {
    redirect("/login");
  };

  const requireRole = (allowedRoles: string[]) => {
    if (!isLoading || isUninitialized) {
      if (!isAuthenticated || !allowedRoles.includes(userRole)) {
        redirectToLogin();
      } else {
        return true;
      }
    } else {
      return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    push("/login");
  };

  return {
    isAuthenticated,
    userRole,
    requireRole,
    handleLogout,
  };
};

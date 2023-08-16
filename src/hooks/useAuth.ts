import { useGetLoggedUserQuery } from "@/services/userApi";
import { logout } from "@/features/user/userSlice";
import { redirect } from "next/navigation";

export const useAuth = () => {
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
    // Call the logout action directly
    logout();
    // Perform any additional logout logic (e.g., clearing tokens)
  };

  return {
    isAuthenticated,
    userRole,
    requireRole,
    handleLogout,
  };
};

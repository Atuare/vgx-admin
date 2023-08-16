import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ProfileEnum } from "@/enums/profile.enum";
import { usePathname } from "next/navigation";
import LoadingIcon from "../LoadingIcon";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: (keyof typeof ProfileEnum)[];
}

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { requireRole } = useAuth();
  const pathname = usePathname();

  if (pathname === "/login") return children;

  const isEmployee = requireRole(allowedRoles);
  if (isEmployee) {
    return children;
  } else {
    return <LoadingIcon />;
  }
}

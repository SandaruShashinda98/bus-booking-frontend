import useAuthGuard from "@/contexts/AuthGuardContext";
import { Navigate, Outlet } from "react-router-dom";

export interface RouteGuardProps {
  allowedRoles: string[];
}

export default function RouteGuard(props: RouteGuardProps) {
  const { user, role } = useAuthGuard();
  console.log("role", role, user);
  return props.allowedRoles.includes(role) ? (
    <Outlet />
  ) : (
    <Navigate to={user ? "/unauthorized" : "/login"} />
  );
}

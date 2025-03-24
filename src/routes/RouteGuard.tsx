import useAuthGuard from "@/contexts/AuthGuardContext";
import { Navigate, Outlet } from "react-router-dom";

export interface RouteGuardProps {
  allowedRoles: string[];
}

export default function RouteGuard(props: RouteGuardProps) {
  const {user,permissions} = useAuthGuard();
  console.log("permissions",permissions,user);
  return permissions.find((p) => props.allowedRoles.includes(p)) ? (
    <Outlet />
  ) : (
    <Navigate to={user ? "/unauthorized" : "/login"} />
  );
}

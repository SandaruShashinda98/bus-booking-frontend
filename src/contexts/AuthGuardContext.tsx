import React, { createContext, useContext, useState } from "react";

export const AuthGuardContext = createContext(null);

export interface AuthGuardProviderProps {
  children: React.ReactNode;
}

export function AuthGuardProvider(props: AuthGuardProviderProps) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState([]);

  return (
    <AuthGuardContext.Provider
      value={{
        user,
        setUser,
        role,
        setRole,
      }}
    >
      {props.children}
    </AuthGuardContext.Provider>
  );
}

export default function useAuthGuard() {
  const context = useContext(AuthGuardContext);

  if (!context) throw new Error("Out of provider scope");

  return context;
}

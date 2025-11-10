import { createContext, useState, useEffect, ReactNode } from "react";

interface User {
  role: string;
  name?: string;
  email?: string;
  _id?: string;
  createdAt?: string;
  approved?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, role: string, userData: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem("role");
      const savedUser = localStorage.getItem("user");
      if (savedRole && savedUser) {
        setUser({ role: savedRole, ...JSON.parse(savedUser) });
      }
    }
  }, []);

  const login = (token: string, role: string, userData: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser({ role, ...userData });
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
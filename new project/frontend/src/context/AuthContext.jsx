import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    const savedUser = localStorage.getItem("user");
    if (savedRole && savedUser) {
      setUser({ role: savedRole, ...JSON.parse(savedUser) });
    }
  }, []);

  const login = (token, role, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser({ role, ...userData });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
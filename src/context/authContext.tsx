"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define o tipo do usuário
interface User {
  username: string;
}

// Define o tipo do contexto
interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

// Cria o contexto com valor inicial
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define o tipo das props do provider
interface AuthProviderProps {
  children: ReactNode;
}

// Componente provedor do contexto
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  // Recupera o usuário do localStorage quando o componente é montado
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedPassword = localStorage.getItem("password");
    if (storedUser && storedPassword) {
      setUser({ username: storedUser });
    }
  }, []);

  // Função de login
  const login = (username: string, password: string) => {
    localStorage.setItem("user", username);
    localStorage.setItem("password", password);
    setUser({ username });
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("password");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

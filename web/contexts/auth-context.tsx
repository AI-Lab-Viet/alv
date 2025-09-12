"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";

interface User {
  email: string;
  name: string;
  school?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: User & { password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  userId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string | null;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        console.log("User found in localStorage:", savedUser);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock login - in real app, this would be an API call
      if (email === "demo@ailabviet.com" && password === "demo123") {
        const userData = {
          email,
          name: "Nguyễn Văn A",
          school: "Đại học Bách Khoa Hà Nội",
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const register = async (
    userData: User & { password: string }
  ): Promise<boolean> => {
    try {
      // Mock registration - in real app, this would be an API call
      const { password, ...userInfo } = userData;
      setUser(userInfo);
      localStorage.setItem("user", JSON.stringify(userInfo));
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isLoading, userId }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

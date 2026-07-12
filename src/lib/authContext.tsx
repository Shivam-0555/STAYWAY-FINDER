"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    // Initialize demo user if not already present
    const users = JSON.parse(localStorage.getItem("stayway_users") || "[]");
    if (!users.some((u: any) => u.email === "demo@example.com")) {
      users.push({
        id: "demo-user-1",
        name: "Demo User",
        email: "demo@example.com",
        phone: "9876543210",
        password: "demo123",
      });
      localStorage.setItem("stayway_users", JSON.stringify(users));
    }

    const storedUser = localStorage.getItem("stayway_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("stayway_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call - in production, verify against backend
    const users = JSON.parse(localStorage.getItem("stayway_users") || "[]");
    const user = users.find((u: any) => u.email === email);

    if (!user || user.password !== password) {
      throw new Error("Invalid email or password");
    }

    const loggedInUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    };

    setUser(loggedInUser);
    localStorage.setItem("stayway_user", JSON.stringify(loggedInUser));
  };

  const signup = async (name: string, email: string, phone: string, password: string) => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("stayway_users") || "[]");
    if (users.find((u: any) => u.email === email)) {
      throw new Error("Email already registered");
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      password, // In production, this should be hashed
    };

    users.push(newUser);
    localStorage.setItem("stayway_users", JSON.stringify(users));

    // Log the user in after signup
    const loggedInUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
    };

    setUser(loggedInUser);
    localStorage.setItem("stayway_user", JSON.stringify(loggedInUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("stayway_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

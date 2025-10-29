"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: number
  email: string
  name: string
  city?: string
  points: number
  level: number
  avatar_url: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, city?: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (name: string, email: string, city: string, newAvatarUrl: string | null) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  uploadAvatar: (formData: FormData) => Promise<string | null>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Login failed")
    }

    const data = await response.json()
    setUser(data.user)
  }

  const register = async (name: string, email: string, password: string, city?: string) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, city }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Registration failed")
    }

    const data = await response.json()
    setUser(data.user)
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
  }

  const updateProfile = async (name: string, email: string, city: string, newAvatarUrl: string | null) => {
    if(newAvatarUrl === null) {
      newAvatarUrl = user?.avatar_url || null
    }

    const response = await fetch("/api/auth/update-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, city, newAvatarUrl }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update profile")
    }

    const data = await response.json()
    setUser(data.user)
  }

  const uploadAvatar = async (formData: FormData) => {
    const response = await fetch("/api/auth/upload-avatar", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload avatar");
    }

    const data = await response.json();
    return data.avatarUrl;
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters")
    }

    const response = await fetch("/api/auth/change-password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to change password")
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, uploadAvatar, changePassword, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

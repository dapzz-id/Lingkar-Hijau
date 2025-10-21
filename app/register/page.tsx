"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Leaf, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [city, setCity] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { register } = useAuth()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!name || !email || !password || !confirmPassword) {
        setError("Semua field harus diisi")
        return
      }

      if (password !== confirmPassword) {
        setError("Password tidak cocok")
        return
      }

      if (password.length < 6) {
        setError("Password minimal 6 karakter")
        return
      }

      await register(name, email, password, city || undefined)
      router.push("/login")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mendaftar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Leaf className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl text-foreground">Lingkar Hijau</span>
          </Link>
        </div>

        {/* Register Card */}
        <Card className="p-8 border border-border">
          <h1 className="text-2xl font-bold text-foreground mb-2">Daftar</h1>
          <p className="text-foreground/60 mb-6">Buat akun baru untuk bergabung dengan komunitas</p>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
                <Input
                  type="text"
                  placeholder="Nama Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
                <Input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Kota (Opsional)</label>
              <Input type="text" placeholder="Kota Anda" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Konfirmasi Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? "Memproses..." : "Daftar"}
            </Button>
          </form>

          <p className="text-center text-foreground/60 text-sm mt-6">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
              Masuk di sini
            </Link>
          </p>
        </Card>

        {/* Password Requirements */}
        <div className="mt-6 p-4 bg-muted rounded-lg space-y-2">
          <p className="text-xs font-medium text-foreground">Persyaratan Password:</p>
          <ul className="text-xs text-foreground/60 space-y-1">
            <li className="flex gap-2">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              Minimal 6 karakter
            </li>
            <li className="flex gap-2">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              Password harus cocok
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

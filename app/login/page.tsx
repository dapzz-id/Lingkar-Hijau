"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Leaf, Mail, Lock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat login")
    } finally {
      setLoading(false)
    }
  }

  // Animation variants for input fields
  const inputVariants = {
    focus: { scale: 1.02, borderColor: "#10B981", transition: { duration: 0.2 } },
    blur: { scale: 1, borderColor: "#E5E7EB", transition: { duration: 0.2 } },
  }

  // Animation variants for card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center mb-6"
        >
          <Link href="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg"
            >
              <Leaf className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <span className="font-extrabold text-3xl tracking-tight text-foreground">Lingkar Hijau</span>
          </Link>
        </motion.div>

        {/* Login Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="p-6 sm:p-8 border border-border/50 dark:border-border/30 bg-background/95 dark:bg-background/80 backdrop-blur-sm shadow-xl rounded-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 tracking-tight">Masuk</h1>
            <p className="text-foreground/60 mb-6 text-sm">Masuk ke akun Anda untuk melanjutkan</p>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-destructive/10 dark:bg-destructive/20 border border-destructive/20 dark:border-destructive/30 rounded-lg flex gap-2"
                >
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40"
                  >
                    <Mail />
                  </motion.div>
                  <motion.div variants={inputVariants} whileFocus="focus" animate="blur">
                    <Input
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 py-5 rounded-lg bg-background/50 dark:bg-background/30 border-border/50 focus:ring-2 focus:ring-primary transition-all duration-300"
                      required
                    />
                  </motion.div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40"
                  >
                    <Lock />
                  </motion.div>
                  <motion.div variants={inputVariants} whileFocus="focus" animate="blur">
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 py-5 rounded-lg bg-background/50 dark:bg-background/30 border-border/50 focus:ring-2 focus:ring-primary transition-all duration-300"
                      required
                    />
                  </motion.div>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 py-5 rounded-lg font-semibold text-base transition-all duration-300 shadow-md"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block mr-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9H4m4 11H3v-5h.582m15.356-2A8.001 8.001 0 013.582 15H3" />
                      </svg>
                    </motion.span>
                  ) : null}
                  {loading ? "Memproses..." : "Masuk"}
                </Button>
              </motion.div>
            </form>

            <p className="text-center text-foreground/60 text-sm mt-6">
              Belum punya akun?{" "}
              <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors duration-200">
                Daftar di sini
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
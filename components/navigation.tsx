"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Leaf, Menu, X, Moon, Sun, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const router = useRouter()
  const { user, logout, loading } = useAuth()

  useEffect(() => {
    // Check dark mode preference
    const theme = localStorage.getItem("theme")
    if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const navLinks = user
    ? [
      { href: "/catalog", label: "Katalog" },
      { href: "/marketplace", label: "Marketplace" },
      { href: "/forum", label: "Forum" },
      { href: "/products", label: "Jual Produk" },
      { href: "/profile", label: "Profil" },
    ]
    : [
      { href: "/#features", label: "Fitur" },
      { href: "/#impact", label: "Dampak" },
      { href: "/#contact", label: "Contact" },
    ]

  const handleLogout = async () => {
    await logout()
    setIsOpen(false) // Tutup mobile menu setelah logout
    router.push("/")
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          { user? 
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground hidden sm:inline">Lingkar Hijau</span>
            </Link>
            : 
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground hidden sm:inline">Lingkar Hijau</span>
            </Link>
          }

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/70 hover:text-foreground transition font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:flex items-center space-x-2 mr-2">
                <span className="text-foreground/70">
                  Halo, {user.name}
                </span>
              </div>
            )}
            
            <button
              onClick={toggleDarkMode}
              className="btn-style-icon p-2 hover:bg-muted rounded-lg transition"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-foreground/70" />}
            </button>

            {/* Desktop Logout Button */}
            {user && (
              <div className="hidden md:block">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-transparent hover:bg-destructive/10 hover:text-destructive border-destructive/20 text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </Button>
              </div>
            )}

            {!user && !loading && (
              <div className="hidden md:flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  onClick={() => router.push("/login")}
                >
                  Masuk
                </Button>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => router.push("/register")}
                >
                  Daftar
                </Button>
              </div>
            )}

            {loading && (
              <div className="hidden md:block">
                <div className="w-20 h-9 bg-muted rounded-lg animate-pulse" />
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="md:hidden p-2 hover:bg-muted rounded-lg transition"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg transition"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="border-t border-border pt-4 mt-2">
              {loading ? (
                <div className="w-full h-9 bg-muted rounded-lg animate-pulse mx-4" />
              ) : user ? (
                <div className="space-y-2 px-4">
                  <div className="flex items-center gap-2 px-2 py-1 mb-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Halo, {user.name}</p>
                      <p className="text-foreground/60 text-xs">{user.email}</p>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent flex items-center gap-2"
                    onClick={() => {
                      router.push("/dashboard")
                      setIsOpen(false)
                    }}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full bg-transparent flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive border-destructive/20 text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2 px-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      router.push("/login")
                      setIsOpen(false)
                    }}
                  >
                    Masuk
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => {
                      router.push("/register")
                      setIsOpen(false)
                    }}
                  >
                    Daftar
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
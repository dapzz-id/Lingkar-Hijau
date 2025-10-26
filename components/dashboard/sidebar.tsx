"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, User, LogOut, Medal, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import DashboardPage from "@/app/dashboard/page"

const itemBase =
  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out"

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const [isMobile, setIsMobile] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const isActive = (href: string) => pathname === href

  const menuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/products", icon: Package, label: "Pengelolaan Produk" },
    { href: "/marketplace", icon: Store, label: "Marketplace" },
    { href: "/dashboard/achievements", icon: Medal, label: "Achievements" },
    { href: "/dashboard/profile", icon: User, label: "Profit" },
  ]

  const handleLogout = async () => {
    await logout()
    router.push("/")
    router.refresh()
  }

  return (
    <aside className={cn(
      "w-full bg-background border border-border rounded-lg p-4 transition-all duration-300",
      isCollapsed ? "md:w-20" : "md:w-64"
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center gap-3 mb-6 transition-all duration-300",
        isCollapsed && "justify-center"
      )}>
        <div className="p-2 rounded-xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg">
          <LayoutDashboard className="w-5 h-5 text-white" />
        </div>
        <h2 className={cn(
          "text-lg font-bold text-foreground transition-all duration-300",
          isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
        )}>
          Dashboard
        </h2>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                itemBase,
                active 
                  ? "bg-primary/10 text-primary border-l-4 border-primary" 
                  : "text-foreground/70 hover:text-foreground hover:bg-muted/50 border-l-4 border-transparent",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Icon className={cn(
                "w-4 h-4",
                active ? "text-primary" : "text-foreground/60"
              )} />
              <span className={cn(
                "transition-all duration-300 whitespace-nowrap",
                isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className={cn(
        "mt-6 transition-all duration-300",
        isCollapsed && "flex justify-center"
      )}>
        <Button
          variant="outline"
          className={cn(
            "w-full bg-transparent border-border hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive",
            isCollapsed && "w-12 h-12 p-0 rounded-full"
          )}
          onClick={handleLogout}
        >
          <LogOut className={cn(
            "w-4 h-4",
            isCollapsed ? "mr-0" : "mr-2"
          )} />
          <span className={cn(
            "transition-all duration-300",
            isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}>
            Kaluar
          </span>
        </Button>
      </div>
    </aside>
  )
}
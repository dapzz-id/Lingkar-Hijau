"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

const itemBase =
  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors"

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  const isActive = (href: string) => pathname === href

  return (
    <aside className="w-full md:w-64 border-r border-border p-4">
      <div className="mb-6 flex items-center gap-2">
        <LayoutDashboard className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
      </div>

      <nav className="space-y-1">
        <Link
          href="/dashboard/products"
          className={`${itemBase} ${
            isActive("/dashboard/products") ? "bg-muted text-foreground" : "text-foreground/70 hover:text-foreground hover:bg-muted"
          }`}
        >
          <Package className="w-4 h-4" /> Pengelolaan Produk
        </Link>
        <Link
          href="/dashboard/profile"
          className={`${itemBase} ${
            isActive("/dashboard/profile") ? "bg-muted text-foreground" : "text-foreground/70 hover:text-foreground hover:bg-muted"
          }`}
        >
          <User className="w-4 h-4" /> Profil
        </Link>
      </nav>

      <div className="mt-6">
        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={async () => {
            await logout()
            router.push("/")
            router.refresh()
          }}
        >
          <LogOut className="w-4 h-4 mr-2" /> Keluar
        </Button>
      </div>
    </aside>
  )
}


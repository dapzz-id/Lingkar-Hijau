"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import { useCart } from "@/lib/cart-context"
import { usePathname } from "next/navigation"

export default function CartFab() {
  const { count } = useCart()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => setMounted(true), [])

  // Sembunyikan tombol jika bukan di /marketplace
  if (!pathname.startsWith("/marketplace")) return null

  return (
    <Link
      href="/cart"
      className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full bg-primary text-primary-foreground p-4 hover:bg-primary/90 transition-colors"
      aria-label="Buka keranjang"
    >
      <div className="relative">
        <ShoppingCart className="w-6 h-6" />
        {mounted && count > 0 && (
          <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1.5 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold">
            {count}
          </span>
        )}
      </div>
    </Link>
  )
}

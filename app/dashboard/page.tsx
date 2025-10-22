"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import DashboardSidebar from "@/components/dashboard/sidebar"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-[16rem_1fr] gap-6">
          <DashboardSidebar />

          <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Selamat datang di Dashboard</h1>
            <Card className="p-6">
              <p className="text-foreground/70 mb-4">
                Pilih menu di sebelah kiri untuk mulai mengelola produk atau memperbarui profil Anda.
              </p>
              <div className="flex gap-3 text-sm">
                <Link href="/dashboard/products" className="text-primary hover:underline">
                  Kelola Produk
                </Link>
                <span className="text-foreground/40">•</span>
                <Link href="/dashboard/profile" className="text-primary hover:underline">
                  Profil
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import DashboardSidebar from "@/components/dashboard/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-[16rem_1fr] gap-6">
          <DashboardSidebar />

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Pengelolaan Produk</h1>
              <Button className="bg-primary text-primary-foreground" disabled>
                + Tambah Produk (dummy)
              </Button>
            </div>

            <Card className="p-6">
              <p className="text-foreground/70 mb-4">Belum ada produk yang ditambahkan.</p>
              <Link href="/marketplace" className="text-primary hover:underline text-sm">
                Lihat marketplace
              </Link>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


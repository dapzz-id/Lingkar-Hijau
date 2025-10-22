"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import DashboardSidebar from "@/components/dashboard/sidebar"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

export default function DashboardProfilePage() {
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-[16rem_1fr] gap-6">
          <DashboardSidebar />

          <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Profil</h1>
            <Card className="p-6 space-y-3">
              {loading ? (
                <div className="h-24 bg-muted rounded-md animate-pulse" />
              ) : user ? (
                <>
                  <div className="flex justify-between py-1">
                    <span className="text-foreground/60">Nama</span>
                    <span className="font-semibold text-foreground">{user.name}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-foreground/60">Email</span>
                    <span className="font-semibold text-foreground">{user.email}</span>
                  </div>
                  {user.city && (
                    <div className="flex justify-between py-1">
                      <span className="text-foreground/60">Kota</span>
                      <span className="font-semibold text-foreground">{user.city}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1">
                    <span className="text-foreground/60">Level</span>
                    <span className="font-semibold text-foreground">{user.level}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-foreground/60">Poin</span>
                    <span className="font-semibold text-foreground">{user.points.toLocaleString('id-ID')}</span>
                  </div>
                </>
              ) : (
                <p className="text-foreground/70">Anda belum masuk.</p>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


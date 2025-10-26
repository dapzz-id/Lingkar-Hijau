"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import DashboardSidebar from "@/components/dashboard/sidebar"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { User, Mail, MapPin, Award, Star } from "lucide-react"

export default function DashboardProfilePage() {
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Profil Saya</h1>
              <p className="text-foreground/60 text-lg">Kelola informasi profil Anda</p>
            </div>

            {/* Profile Card */}
            <Card className="p-8 space-y-6 border-2 border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded-lg animate-pulse" />
                  <div className="h-8 bg-muted rounded-lg animate-pulse" />
                  <div className="h-8 bg-muted rounded-lg animate-pulse" />
                </div>
              ) : user ? (
                <>
                  {/* Profile Header with Avatar */}
                  <div className="flex items-center gap-4 pb-6 border-b border-border/50">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/30">
                        {user.avatar_url ? (
                          <img 
                            src={user.avatar_url} 
                            alt={user.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-primary/60" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                        <Star className="w-3 h-3 text-primary-foreground fill-current" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                      <p className="text-foreground/60">Member Level {user.level}</p>
                    </div>
                  </div>

                  {/* Profile Information Grid */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Personal Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Informasi Pribadi
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-foreground/40" />
                            <span className="text-foreground/60">Email</span>
                          </div>
                          <span className="font-semibold text-foreground text-right">{user.email}</span>
                        </div>

                        {user.city && (
                          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-foreground/40" />
                              <span className="text-foreground/60">Kota</span>
                            </div>
                            <span className="font-semibold text-foreground">{user.city}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        Statistik
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <span className="text-foreground/60">Level</span>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="font-semibold text-foreground">Level {user.level}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:from-primary/15 hover:to-primary/10 transition-colors">
                          <span className="text-foreground/60">Total Poin</span>
                          <span className="font-bold text-primary text-lg">
                            {user.points.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar for Level */}
                  <div className="pt-4 border-t border-border/50">
                    <div className="flex justify-between text-sm text-foreground/60 mb-2">
                      <span>Progress Menuju Level {parseInt(user.level) + 1}</span>
                      <span>{Math.min(user.points / 100, 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min((user.points % 1000) / 10, 100)}%` }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <User className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
                  <p className="text-foreground/70 text-lg">Anda belum masuk.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
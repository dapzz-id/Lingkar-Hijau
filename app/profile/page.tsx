"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useMemo } from "react"
import { User, Mail, MapPin, Award, Star } from "lucide-react"

export default function DashboardProfilePage() {
  const { user, loading } = useAuth()

  // 🧩 Hitung level dan progress (500 poin per level)
  const levelData = useMemo(() => {
    if (!user) return { level: 1, progress: 0, nextLevelPoints: 500 }

    const level = Math.floor(user.points / 500) + 1
    const prevThreshold = (level - 1) * 500
    const nextThreshold = level * 500
    const progress = ((user.points - prevThreshold) / (nextThreshold - prevThreshold)) * 100

    return {
      level,
      progress: Math.min(progress, 100),
      nextLevelPoints: nextThreshold,
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    fetch("/api/update-level", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ points: user.points }),
    }).catch(() => {})
  }, [user])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Header Section */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Profil Saya</h1>
            <p className="text-foreground/60 text-base sm:text-lg">Kelola informasi profil Anda</p>
          </div>

          {/* Profile Card */}
          <Card className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 border-2 border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
            {loading ? (
              <div className="space-y-4">
                <div className="h-6 sm:h-8 bg-muted rounded-lg animate-pulse" />
                <div className="h-6 sm:h-8 bg-muted rounded-lg animate-pulse" />
                <div className="h-6 sm:h-8 bg-muted rounded-lg animate-pulse" />
              </div>
            ) : user ? (
              <>
                {/* Profile Header with Avatar */}
                <div className="flex items-center gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-border/50">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/30">
                      {user.avatar_url ? (
                        <img 
                          src={user.avatar_url} 
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary/60" />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-foreground fill-current" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground wrap-break-word">{user.name}</h2>
                    <p className="text-foreground/60 text-sm sm:text-base">Member Level {levelData.level}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                  {/* Personal Info */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      Informasi Pribadi
                    </h3>
                    
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-foreground/40 shrink-0" />
                          <span className="text-foreground/60 text-sm sm:text-base">Email</span>
                        </div>
                        <span className="font-semibold text-foreground text-right text-xs sm:text-sm break-all ml-2">
                          {user.email}
                        </span>
                      </div>

                      {user.city && (
                        <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-foreground/40 shrink-0" />
                            <span className="text-foreground/60 text-sm sm:text-base">Kota</span>
                          </div>
                          <span className="font-semibold text-foreground text-sm sm:text-base">{user.city}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      Statistik
                    </h3>
                    
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <span className="text-foreground/60 text-sm sm:text-base">Level</span>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary" />
                          <span className="font-semibold text-foreground text-sm sm:text-base">Level {levelData.level}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-linear-to-r from-primary/10 to-primary/5 border border-primary/20 hover:from-primary/15 hover:to-primary/10 transition-colors">
                        <span className="text-foreground/60 text-sm sm:text-base">Total Poin</span>
                        <span className="font-bold text-primary text-base sm:text-lg">
                          {user.points.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="pt-3 sm:pt-4 border-t border-border/50">
                  <div className="flex justify-between text-xs sm:text-sm text-foreground/60 mb-1.5 sm:mb-2">
                    <span>Progress Menuju Level {levelData.level + 1}</span>
                    <span>{levelData.progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 sm:h-2">
                    <div 
                      className="bg-primary h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${levelData.progress}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <User className="w-12 h-12 sm:w-16 sm:h-16 text-foreground/30 mx-auto mb-3 sm:mb-4" />
                <p className="text-foreground/70 text-base sm:text-lg">Anda belum masuk.</p>
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
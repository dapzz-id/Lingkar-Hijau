"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, TrendingUp, TrendingDown, Award, Zap } from "lucide-react"

const cityLeaderboard = [
  { rank: 1, city: "Jakarta", points: 125000, trend: "up", change: 5200 },
  { rank: 2, city: "Surabaya", points: 98500, trend: "up", change: 3100 },
  { rank: 3, city: "Bandung", points: 87300, trend: "down", change: -1200 },
  { rank: 4, city: "Medan", points: 76200, trend: "up", change: 2800 },
  { rank: 5, city: "Yogyakarta", points: 65400, trend: "stable", change: 0 },
]

const userLeaderboard = [
  { rank: 1, name: "Budi Santoso", level: 15, points: 45000, badges: 8 },
  { rank: 2, name: "Siti Nurhaliza", level: 14, points: 42300, badges: 7 },
  { rank: 3, name: "Eka Putri", level: 13, points: 38900, badges: 6 },
  { rank: 4, name: "Ahmad Wijaya", level: 12, points: 35600, badges: 5 },
  { rank: 5, name: "Rini Kusuma", level: 11, points: 32100, badges: 5 },
]

const achievements = [
  { id: 1, name: "Pemula Hijau", icon: "🌱", rarity: "Common", description: "Selesaikan 5 laporan sampah" },
  { id: 2, name: "Penggemar Daur Ulang", icon: "♻️", rarity: "Common", description: "Beli 3 produk daur ulang" },
  { id: 3, name: "Duta Lingkungan", icon: "🌍", rarity: "Rare", description: "Buat 10 thread forum" },
  { id: 4, name: "Ahli Klasifikasi", icon: "🔍", rarity: "Rare", description: "Scan 50 sampah dengan AI" },
  { id: 5, name: "Legenda Hijau", icon: "👑", rarity: "Epic", description: "Capai level 10" },
  { id: 6, name: "Pahlawan Bumi", icon: "🏆", rarity: "Legendary", description: "Kumpulkan semua achievement" },
]

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("city")

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "Common":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
      case "Rare":
        return "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100"
      case "Epic":
        return "bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100"
      case "Legendary":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Trophy className="w-8 h-8 text-primary" />
            Leaderboard Kota Hijau
          </h1>
          <p className="text-foreground/60">Kompetisi positif untuk mendorong sustainability di setiap kota</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("city")}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === "city"
                ? "text-primary border-b-2 border-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Leaderboard Kota
          </button>
          <button
            onClick={() => setActiveTab("user")}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === "user"
                ? "text-primary border-b-2 border-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Leaderboard Pengguna
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === "achievements"
                ? "text-primary border-b-2 border-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Achievements
          </button>
        </div>

        {/* City Leaderboard */}
        {activeTab === "city" && (
          <div className="space-y-4">
            {cityLeaderboard.map((entry) => (
              <Card key={entry.rank} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-lg font-bold text-primary-foreground">
                        {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : entry.rank}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{entry.city}</h3>
                      <p className="text-sm text-foreground/60">{entry.points.toLocaleString('id-ID')} poin</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {entry.trend === "up" && (
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-semibold">+{entry.change.toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    {entry.trend === "down" && (
                      <div className="flex items-center gap-1 text-red-600">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-sm font-semibold">{entry.change.toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    {entry.trend === "stable" && <div className="text-foreground/60 text-sm">Stabil</div>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* User Leaderboard */}
        {activeTab === "user" && (
          <div className="space-y-4">
            {userLeaderboard.map((entry) => (
              <Card key={entry.rank} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-lg font-bold text-primary-foreground">
                        {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : entry.rank}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{entry.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground/60">Level {entry.level}</span>
                        <span className="text-sm text-foreground/60">•</span>
                        <span className="text-sm text-foreground/60">{entry.points.toLocaleString('id-ID')} poin</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {[...Array(entry.badges)].map((_, i) => (
                      <Award key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Achievements */}
        {activeTab === "achievements" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="text-5xl mb-3">{achievement.icon}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{achievement.name}</h3>
                  <Badge className={`mb-3 ${getRarityColor(achievement.rarity)}`}>{achievement.rarity}</Badge>
                  <p className="text-sm text-foreground/60">{achievement.description}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

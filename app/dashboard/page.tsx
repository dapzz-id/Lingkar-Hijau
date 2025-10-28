"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Medal, Star, TrendingUp, Recycle, Package } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  eco_score: number;
  rating: number;
  reviews_count: number;
}

interface Achievement {
  id: string;
  name: string;
  icon: string;
  rarity: string;
  description: string;
  unlocked_at: string;
}

interface DashboardData {
  stats: { totalPoints: number; achievementCount: number; productSoldCount: number };
  recentAchievements: Achievement[];
  userProducts: Product[];
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: { totalPoints: 0, achievementCount: 0, productSoldCount: 0 },
    recentAchievements: [],
    userProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();
        console.table("Dashboard data:", data);
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center py-10 text-foreground/60">Loading...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2 mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-foreground/60 text-sm sm:text-base">
            Selamat datang kembali! Mari terus berkontribusi untuk Indonesia Emas 2045
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          <Card className="bg-card border-border text-center">
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">{dashboardData.stats.totalPoints}</div>
              <div className="text-sm font-medium text-foreground/70">Total Points</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border text-center">
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">{dashboardData.stats.productSoldCount}</div>
              <div className="text-sm font-medium text-foreground/70">Your Products</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
        >
          <Card className="bg-card border-border">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-foreground">
                <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                Achievement Terbaru
              </CardTitle>
              <CardDescription className="text-foreground/60">
                Pencapaian yang baru Anda dapatkan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <AnimatePresence>
                {dashboardData.recentAchievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-background/50"
                  >
                    <div className="text-xl sm:text-2xl text-foreground flex-shrink-0">{achievement.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <h4 className="font-semibold text-foreground text-sm sm:text-base">{achievement.name}</h4>
                        <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground w-fit">
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-foreground/60 mb-1 sm:mb-2">{achievement.description}</p>
                      <p className="text-xs text-foreground/40">
                        Unlocked: {new Date(achievement.unlocked_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button variant="outline" className="w-full mt-2 border-border text-foreground hover:bg-accent">
                <a href="/dashboard/achievements" className="w-full">Lihat Semua Achievement</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-foreground">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Produk Marketplace Anda
              </CardTitle>
              <CardDescription className="text-foreground/60">
                Produk yang sedang Anda jual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <AnimatePresence>
                {dashboardData.userProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-background/50"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <Recycle className="h-4 w-4 sm:h-6 sm:w-6 text-foreground/60" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <h4 className="font-semibold text-foreground text-sm sm:text-base truncate">{product.name}</h4>
                        <Badge variant="outline" className="text-xs text-foreground/70 border-border w-fit">
                          Eco: {product.eco_score}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-foreground/60 mb-1 sm:mb-2 capitalize">{product.category}</p>
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-4">
                        <span className="font-bold text-primary text-sm">
                          Rp {(Number(product.price)).toLocaleString('id-ID')}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-foreground/50">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {product.rating} ({product.reviews_count})
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button variant="outline" className="w-full mt-2 border-border text-foreground hover:bg-accent">
                <a href="/marketplace" className="w-full">Kelola Semua Produk</a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
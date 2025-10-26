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

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2 mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">
            Selamat datang kembali! Mari terus berkontribusi untuk Indonesia Emas 2045
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-white/80 backdrop-blur-md border border-gray-200 text-center shadow-sm">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-gray-800 mb-2">{dashboardData.stats.totalPoints}</div>
              <div className="text-sm font-medium text-gray-700 mb-1">Total Points</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-md border border-gray-200 text-center shadow-sm">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-gray-800 mb-2">{dashboardData.stats.achievementCount}</div>
              <div className="text-sm font-medium text-gray-700 mb-1">Your Achievement</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-md border border-gray-200 text-center shadow-sm">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-gray-800 mb-2">{dashboardData.stats.productSoldCount}</div>
              <div className="text-sm font-medium text-gray-700 mb-1">Your Products</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Achievement Terbaru */}
          <Card className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                <Medal className="h-5 w-5 text-yellow-500" />
                Achievement Terbaru
              </CardTitle>
              <CardDescription className="text-gray-600">
                Pencapaian yang baru Anda dapatkan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnimatePresence>
                {dashboardData.recentAchievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-start gap-4 p-4 rounded-lg bg-white/50"
                  >
                    <div className="text-2xl text-gray-800 flex-shrink-0">{achievement.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800">{achievement.name}</h4>
                        <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-700">
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                      <p className="text-xs text-gray-500">
                        Unlocked: {new Date(achievement.unlocked_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button variant="outline" className="w-full mt-2 border-gray-300 text-gray-800 hover:bg-gray-100">
                <a href="/dashboard/achievements">Lihat Semua Achievement</a>
              </Button>
            </CardContent>
          </Card>

          {/* Produk Marketplace Anda */}
          <Card className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                <Package className="h-5 w-5 text-blue-500" />
                Produk Marketplace Anda
              </CardTitle>
              <CardDescription className="text-gray-600">
                Produk yang sedang Anda jual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnimatePresence>
                {dashboardData.userProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-start gap-4 p-4 rounded-lg bg-white/50"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Recycle className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800 truncate">{product.name}</h4>
                        <Badge variant="outline" className="text-xs text-gray-700 border-gray-300">
                          Eco: {product.eco_score}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 capitalize">{product.category}</p>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-blue-600 text-sm">
                          Rp {(Number(product.price)).toLocaleString('id-ID')}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {product.rating} ({product.reviews_count})
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button variant="outline" className="w-full mt-2 border-gray-300 text-gray-800 hover:bg-gray-100">
                <a href="/dashboard/products">Kelola Semua Produk</a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
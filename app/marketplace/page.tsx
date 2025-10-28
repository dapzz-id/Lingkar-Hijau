"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, Star, ShoppingCart, Search, Leaf } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { motion, AnimatePresence } from "framer-motion"

type Product = {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url?: string;
  seller_id?: string;
  seller_name?: string;
  eco_score?: number;
  rating?: number;
  reviews_count?: number;
};

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState(new Set())
  const [sortBy, setSortBy] = useState("popular")
  const { addItem } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/marketplace?search=${searchQuery}&sortBy=${sortBy}`
        )
        const data = await response.json()
        setProducts(data.data || [])
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [searchQuery, sortBy])

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    setFavorites(newFavorites)
  }

  if (loading) return <div className="text-center py-10 text-foreground/60">Loading...</div>

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">Marketplace Daur Ulang</h1>
          <p className="text-foreground/60 text-sm sm:text-base">Jual-beli barang hasil daur ulang dengan kualitas terbaik</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-foreground/40" />
            <Input
              placeholder="Cari produk daur ulang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 bg-card border-border"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 sm:px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm sm:text-base"
          >
            <option value="popular">Paling Populer</option>
            <option value="price-low">Harga Terendah</option>
            <option value="price-high">Harga Tertinggi</option>
            <option value="rating">Rating Tertinggi</option>
          </select>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          <AnimatePresence>
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Link href={`/marketplace/${product.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-card border-border h-full flex flex-col">
                    <div
                      className="h-40 sm:h-48 relative bg-cover bg-center"
                      style={{
                        backgroundImage: product.image_url
                          ? `url(${product.image_url})`
                          : "linear-gradient(to bottom right, hsl(var(--primary)), hsl(var(--primary)/0.7))",
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          toggleFavorite(product.id)
                        }}
                        className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-background/80 rounded-lg hover:bg-background transition"
                      >
                        <Heart
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            favorites.has(product.id) ? "fill-red-500 text-red-500" : "text-foreground/40"
                          }`}
                        />
                      </button>
                      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 flex items-center gap-1 bg-background/80 px-2 py-1 rounded text-xs">
                        <Leaf className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                        <span className="font-semibold text-foreground">{product.eco_score}</span>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 flex-1 flex flex-col">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2 text-sm sm:text-base">{product.name}</h3>
                      <p className="text-xs text-foreground/60 mb-2 sm:mb-3">
                        {product.seller_name ? `Seller: ${product.seller_name}` : "Unknown Seller"}
                      </p>

                      <div className="flex items-center gap-1 mb-2 sm:mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(product.rating || 0)
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-foreground/20"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-foreground/60">({product.reviews_count || 0})</span>
                      </div>

                      <div className="mb-3 sm:mb-4 mt-auto">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base sm:text-lg font-bold text-primary">
                            Rp {(Number(product.price || 0)).toLocaleString("id-ID")}
                          </span>
                          {product.original_price && (
                            <span className="text-xs text-foreground/40 line-through">
                              Rp {(Number(product.original_price || 0)).toLocaleString("id-ID")}
                            </span>
                          )}
                        </div>
                        {product.original_price && (
                          <p className="text-xs text-green-600 font-semibold">
                            Hemat Rp {((Number(product.original_price - product.price) || 0)).toLocaleString("id-ID")}
                          </p>
                        )}
                      </div>

                      <Button
                        onClick={(e) => {
                          e.preventDefault()
                          addItem(
                            {
                              id: Number(product.id),
                              name: product.name,
                              price: product.price || 0,
                              image: product.image_url || "",
                            },
                            1
                          )
                        }}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base py-2"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Tambah ke Keranjang
                      </Button>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
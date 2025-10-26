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

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center">Marketplace Daur Ulang</h1>
          <p className="text-gray-600 text-center">Jual-beli barang hasil daur ulang dengan kualitas terbaik</p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid md:grid-cols-3 gap-4 mb-8"
        >
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <Input
              placeholder="Cari produk daur ulang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-md border border-gray-200"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-md text-gray-800"
          >
            <option value="popular">Paling Populer</option>
            <option value="price-low">Harga Terendah</option>
            <option value="price-high">Harga Tertinggi</option>
            <option value="rating">Rating Tertinggi</option>
          </select>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-md border border-gray-200">
                    {/* Product Image */}
                    <div
                      className="h-50 relative bg-cover bg-center"
                      style={{
                        backgroundImage: product.image_url
                          ? `url(${product.image_url})`
                          : "linear-gradient(to bottom right, #60a5fa, #2563eb)",
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          toggleFavorite(product.id)
                        }}
                        className="absolute top-3 right-3 p-2 bg-white/80 rounded-lg hover:bg-gray-100 transition"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites.has(product.id) ? "fill-red-500 text-red-500" : "text-gray-500"
                          }`}
                        />
                      </button>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/80 px-2 py-1 rounded">
                        <Leaf className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-semibold text-gray-800">{product.eco_score}</span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-gray-600 mb-3">
                        {product.seller_name ? `Seller: ${product.seller_name}` : "Unknown Seller"}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(product.rating || 0)
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">({product.reviews_count || 0})</span>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-blue-600">
                            Rp {(Number(product.price || 0)).toLocaleString("id-ID")}
                          </span>
                          {product.original_price && (
                            <span className="text-xs text-gray-500 line-through">
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

                      {/* Add to Cart Button */}
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
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
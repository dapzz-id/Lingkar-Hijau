"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, Star, ShoppingCart, Search, Leaf } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"

const products = [
  {
    id: 1,
    name: "Tas Belanja dari Plastik Daur Ulang",
    seller: "Komunitas Hijau Jakarta",
    price: 85000,
    originalPrice: 120000,
    rating: 4.8,
    reviews: 245,
    ecoScore: 95,
    image: "bg-gradient-to-br from-blue-400 to-blue-600",
  },
  {
    id: 2,
    name: "Kursi Kayu dari Limbah Konstruksi",
    seller: "Daur Ulang Bersama",
    price: 450000,
    originalPrice: 600000,
    rating: 4.6,
    reviews: 128,
    ecoScore: 88,
    image: "bg-gradient-to-br from-amber-400 to-amber-600",
  },
  {
    id: 3,
    name: "Pot Tanaman dari Kaleng Bekas",
    seller: "Green Craft Studio",
    price: 35000,
    originalPrice: 50000,
    rating: 4.9,
    reviews: 512,
    ecoScore: 92,
    image: "bg-gradient-to-br from-green-400 to-green-600",
  },
  {
    id: 4,
    name: "Dompet dari Bahan Daur Ulang",
    seller: "Eco Fashion ID",
    price: 125000,
    originalPrice: 180000,
    rating: 4.7,
    reviews: 189,
    ecoScore: 90,
    image: "bg-gradient-to-br from-purple-400 to-purple-600",
  },
  {
    id: 5,
    name: "Lampu dari Botol Kaca Bekas",
    seller: "Kreasi Cahaya",
    price: 95000,
    originalPrice: 140000,
    rating: 4.8,
    reviews: 367,
    ecoScore: 94,
    image: "bg-gradient-to-br from-cyan-400 to-cyan-600",
  },
  {
    id: 6,
    name: "Tas Ransel dari Bahan Daur Ulang",
    seller: "Sustainable Bags Co",
    price: 275000,
    originalPrice: 380000,
    rating: 4.9,
    reviews: 423,
    ecoScore: 96,
    image: "bg-gradient-to-br from-red-400 to-red-600",
  },
]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState(new Set())
  const [sortBy, setSortBy] = useState("popular")
  const { addItem } = useCart()

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    setFavorites(newFavorites)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Marketplace Daur Ulang</h1>
          <p className="text-foreground/60">Jual-beli barang hasil daur ulang dengan harga adil</p>
        </div>

        {/* Search & Filter */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
            <Input
              placeholder="Cari produk daur ulang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
          >
            <option value="popular">Paling Populer</option>
            <option value="price-low">Harga Terendah</option>
            <option value="price-high">Harga Tertinggi</option>
            <option value="rating">Rating Tertinggi</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/marketplace/${product.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              {/* Product Image */}
              <div className={`h-48 ${product.image} relative`}>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    toggleFavorite(product.id)
                  }}
                  className="absolute top-3 right-3 p-2 bg-background/80 rounded-lg hover:bg-background transition"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.has(product.id) ? "fill-red-500 text-red-500" : "text-foreground/60"
                    }`}
                  />
                </button>
                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-background/80 px-2 py-1 rounded">
                  <Leaf className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-semibold text-foreground">{product.ecoScore}</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-xs text-foreground/60 mb-3">{product.seller}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating) ? "fill-yellow-500 text-yellow-500" : "text-foreground/20"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-foreground/60">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-primary">Rp {product.price.toLocaleString('id-ID')}</span>
                    <span className="text-xs text-foreground/50 line-through">
                      Rp {product.originalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <p className="text-xs text-green-600 font-semibold">
                    Hemat Rp {(product.originalPrice - product.price).toLocaleString('id-ID')}
                  </p>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    addItem(
                      {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                      },
                      1,
                    )
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Tambah ke Keranjang
                </Button>
              </div>
            </Card>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

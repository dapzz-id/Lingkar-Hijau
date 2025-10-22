"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Star, ShoppingCart } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"

interface RelatedProductsProps {
  currentProductId: number
}

const relatedProducts = [
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
]

export default function RelatedProducts({ currentProductId }: RelatedProductsProps) {
  const [favorites, setFavorites] = useState(new Set())
  const { addItem } = useCart()

  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    setFavorites(newFavorites)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Produk Terkait</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <Link key={product.id} href={`/marketplace/${product.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
              {/* Product Image */}
              <div className={`h-40 ${product.image} relative flex-shrink-0`}>
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
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 text-sm">{product.name}</h3>
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
                <div className="mb-4 flex-grow">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-primary">Rp {product.price.toLocaleString('id-ID')}</span>
                    <span className="text-xs text-foreground/50 line-through">
                      Rp {product.originalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    addItem({ id: product.id, name: product.name, price: product.price, image: product.image }, 1)
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Tambah
                </Button>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

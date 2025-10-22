"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import ProductGallery from "@/components/marketplace/product-gallery"
import ProductReviews from "@/components/marketplace/product-reviews"
import RelatedProducts from "@/components/marketplace/related-products"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react"
import { useCart } from "@/lib/cart-context"

// Sample product data - in real app, fetch from API
const productData = {
  id: 1,
  name: "Tas Belanja dari Plastik Daur Ulang",
  seller: "Komunitas Hijau Jakarta",
  sellerRating: 4.8,
  sellerReviews: 1250,
  price: 85000,
  originalPrice: 120000,
  rating: 4.8,
  reviewCount: 245,
  ecoScore: 95,
  images: [
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-blue-500 to-blue-700",
    "bg-gradient-to-br from-blue-300 to-blue-500",
    "bg-gradient-to-br from-blue-600 to-blue-800",
  ],
  description:
    "Tas belanja berkualitas tinggi yang dibuat dari plastik daur ulang berkualitas premium. Desain modern dan fungsional dengan kapasitas besar, cocok untuk belanja sehari-hari atau aktivitas outdoor.",
  specifications: {
    material: "Plastik Daur Ulang (HDPE)",
    dimensions: "40cm x 35cm x 15cm",
    weight: "250g",
    capacity: "25 liter",
    color: "Biru",
    warranty: "1 tahun",
  },
  features: [
    "Terbuat dari 100% plastik daur ulang",
    "Desain ergonomis dengan pegangan yang nyaman",
    "Tahan air dan mudah dibersihkan",
    "Kapasitas besar hingga 25 liter",
    "Ramah lingkungan dan dapat didaur ulang kembali",
    "Tersedia dalam berbagai warna",
  ],
  stock: 45,
  sold: 312,
  ecoImpact: {
    plasticSaved: "2.5kg",
    carbonReduced: "8.5kg CO2",
    waterSaved: "45 liter",
  },
  shipping: {
    cost: 15000,
    estimatedDays: "3-5 hari kerja",
    freeAbove: 200000,
  },
  reviews: [
    {
      id: 1,
      author: "Budi Santoso",
      rating: 5,
      date: "2 minggu lalu",
      title: "Produk berkualitas dan ramah lingkungan!",
      content:
        "Tas ini sangat bagus, kuat dan tahan lama. Saya sudah menggunakannya setiap hari untuk belanja dan masih dalam kondisi sempurna.",
      helpful: 45,
      images: [],
    },
    {
      id: 2,
      author: "Siti Nurhaliza",
      rating: 4,
      date: "1 bulan lalu",
      title: "Bagus, tapi warna sedikit berbeda",
      content:
        "Produk sesuai deskripsi, hanya saja warna di foto terlihat lebih cerah dari aslinya. Tapi tetap bagus dan fungsional.",
      helpful: 23,
      images: [],
    },
  ],
}

export default function ProductDetailPage() {
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const { addItem } = useCart()

  const discount = Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-foreground/60 mb-8">
          <a href="/marketplace" className="hover:text-foreground transition">
            Marketplace
          </a>
          <span>/</span>
          <span className="text-foreground">{productData.name}</span>
        </div>

        {/* Product Main Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Gallery */}
          <ProductGallery images={productData.images} productName={productData.name} />

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{productData.name}</h1>
                  <a href="#" className="text-primary hover:underline text-sm font-medium">
                    {productData.seller}
                  </a>
                </div>
                <button onClick={() => setIsFavorite(!isFavorite)} className="p-2 hover:bg-muted rounded-lg transition">
                  <Heart className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-foreground/60"}`} />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < Math.floor(productData.rating) ? "text-yellow-500" : "text-foreground/20"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="font-semibold text-foreground">{productData.rating}</span>
                </div>
                <span className="text-foreground/60">({productData.reviewCount} ulasan)</span>
                <span className="text-foreground/60">|</span>
                <span className="text-foreground/60">{productData.sold} terjual</span>
              </div>
            </div>

            {/* Price Section */}
            <Card className="p-4 bg-muted/50 border-primary/20">
              <div className="space-y-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">Rp {productData.price.toLocaleString('id-ID')}</span>
                  <span className="text-lg text-foreground/50 line-through">
                    Rp {productData.originalPrice.toLocaleString('id-ID')}
                  </span>
                  <span className="px-2 py-1 bg-red-500/20 text-red-600 rounded text-sm font-semibold">
                    -{discount}%
                  </span>
                </div>
                <p className="text-sm text-green-600 font-semibold">
                  Hemat Rp {(productData.originalPrice - productData.price).toLocaleString('id-ID')}
                </p>
              </div>
            </Card>

            {/* Eco Impact */}
            <Card className="p-4 border-green-500/30 bg-green-500/5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="text-2xl">🌱</span> Dampak Lingkungan
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Plastik Terselamatkan</p>
                  <p className="font-bold text-primary">{productData.ecoImpact.plasticSaved}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Karbon Berkurang</p>
                  <p className="font-bold text-primary">{productData.ecoImpact.carbonReduced}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Air Terhemat</p>
                  <p className="font-bold text-primary">{productData.ecoImpact.waterSaved}</p>
                </div>
              </div>
            </Card>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-foreground/60">Jumlah:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-muted transition"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-semibold text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(productData.stock, quantity + 1))}
                    className="px-3 py-2 hover:bg-muted transition"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-foreground/60">Stok: {productData.stock}</span>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() =>
                    addItem(
                      { id: productData.id, name: productData.name, price: productData.price, image: productData.images[0] },
                      quantity,
                    )
                  }
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-base py-6"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Tambah ke Keranjang
                </Button>
                <Button variant="outline" size="lg" className="px-6 bg-transparent">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Shipping & Guarantees */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Pengiriman</p>
                  <p className="text-xs text-foreground/60">
                    {productData.shipping.estimatedDays} • Rp {productData.shipping.cost.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Garansi</p>
                  <p className="text-xs text-foreground/60">{productData.specifications.warranty}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Pengembalian</p>
                  <p className="text-xs text-foreground/60">30 hari uang kembali</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-12">
          <div className="flex gap-4 border-b border-border mb-6 overflow-x-auto">
            {["description", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground/60 hover:text-foreground"
                }`}
              >
                {tab === "description" && "Deskripsi"}
                {tab === "specifications" && "Spesifikasi"}
                {tab === "reviews" && "Ulasan"}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "description" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Deskripsi Produk</h3>
                  <p className="text-foreground/70 leading-relaxed">{productData.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Fitur Utama</h3>
                  <ul className="space-y-2">
                    {productData.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-foreground/70">
                        <span className="text-primary font-bold mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Spesifikasi Produk</h3>
                <div className="space-y-3">
                  {Object.entries(productData.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-foreground/60 capitalize">
                        {key === "warranty" ? "Garansi" : key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span className="font-semibold text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && <ProductReviews reviews={productData.reviews} rating={productData.rating} />}
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts currentProductId={productData.id} />
      </main>

      <Footer />
    </div>
  )
}

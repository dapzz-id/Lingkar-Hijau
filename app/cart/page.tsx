"use client"

import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { Trash2, Plus, Minus, CheckCircle, ArrowLeft, ShoppingBag } from "lucide-react"
import { useState } from "react"

export default function CartPage() {
  const { items, total, count, updateQuantity, removeItem, clear } = useCart()
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const calculatePoints = () => {
    return items.reduce((totalPoints, item) => totalPoints + (item.quantity * 100), 0)
  }

  const handleCheckout = async () => {
    setIsProcessing(true)
    setError(null)
    
    const pointsToEarn = calculatePoints()
    setEarnedPoints(pointsToEarn)
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items,
          total: total
        })
      })

      const data = await response.json()

      if (response.ok) {
        clear()
        setIsCheckoutModalOpen(true)
      } else {
        setError(data.error || data.details || "Gagal melakukan checkout")
        console.error("Checkout failed:", data)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      setError("Terjadi kesalahan jaringan saat checkout")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/marketplace" className="sm:hidden">
              <ArrowLeft className="w-5 h-5 text-foreground/60" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Keranjang</h1>
              <p className="text-foreground/60 text-sm sm:text-base mt-1">
                {items.length > 0 ? `${count} item di keranjang` : "Keranjang belanja Anda"}
              </p>
            </div>
          </div>
          {items.length > 0 && (
            <Button 
              variant="outline" 
              onClick={clear} 
              className="bg-transparent w-full sm:w-auto order-3 sm:order-2"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Kosongkan Keranjang
            </Button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <Card className="p-4 mb-4 border-red-200 bg-red-50">
            <div className="flex items-center gap-2 text-red-700">
              <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <p className="text-sm">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </Card>
        )}

        {items.length === 0 ? (
          <Card className="p-6 sm:p-8 text-center">
            {isCheckoutModalOpen ? (
              <div className="space-y-4 sm:space-y-6">
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto" />
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Checkout Berhasil!</h2>
                  <p className="text-foreground/70 text-sm sm:text-base">
                    Terima kasih telah berbelanja. Anda mendapatkan {earnedPoints} poin!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-4 sm:mt-6">
                  <Link href="/marketplace" className="w-full sm:w-auto">
                    <Button className="bg-primary text-primary-foreground w-full">
                      Lanjut Belanja
                    </Button>
                  </Link>
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full">
                      Lihat Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <ShoppingBag className="w-16 h-16 sm:w-20 sm:h-20 text-foreground/30 mx-auto" />
                <div className="space-y-2">
                  <p className="text-foreground/70 text-base sm:text-lg">Keranjang Anda kosong.</p>
                  <p className="text-foreground/50 text-sm">Mulai berbelanja untuk menemukan produk eco-friendly</p>
                </div>
                <Link href="/marketplace" className="inline-block">
                  <Button className="bg-primary text-primary-foreground w-full sm:w-auto px-6">
                    Mulai Belanja
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    {/* Product Info */}
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        {item.image ? (
                          item.image.startsWith("http") || item.image.startsWith("/") || item.image.startsWith("data:") ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 sm:w-16 sm:h-16 rounded-md object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-md ${item.image} bg-muted`} />
                          )
                        ) : (
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-md bg-muted flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/30" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                          {item.name}
                        </h3>
                        <p className="text-foreground/60 text-xs sm:text-sm mt-0.5">
                          Rp {Number(item.price)?.toLocaleString('id-ID')}
                        </p>
                        <p className="text-green-600 text-xs mt-1">
                          +{item.quantity * 100} poin
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls and Price */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          onClick={() => (item.quantity <= 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1))}
                          className="px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-muted transition text-foreground/60 hover:text-foreground"
                          aria-label="Kurangi"
                        >
                          <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <span className="px-2 sm:px-4 py-1.5 sm:py-2 font-semibold text-foreground min-w-8 text-center text-sm sm:text-base">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-muted transition text-foreground/60 hover:text-foreground"
                          aria-label="Tambah"
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>

                      {/* Price and Remove */}
                      <div className="text-right flex flex-col items-end gap-1 sm:gap-2">
                        <div className="font-semibold text-foreground text-sm sm:text-base">
                          Rp {Number(item.price * item.quantity)?.toLocaleString('id-ID')}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-500/10 h-8 px-2 sm:px-3 text-xs"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="hidden xs:inline">Hapus</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-4 sm:p-6 space-y-3 sm:space-y-4 sticky top-4">
                <h3 className="font-semibold text-foreground text-lg sm:text-xl mb-2">Ringkasan Belanja</h3>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/60 text-sm sm:text-base">Jumlah Item</span>
                    <span className="font-semibold text-foreground text-sm sm:text-base">{count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/60 text-sm sm:text-base">Total Poin</span>
                    <span className="font-semibold text-green-600 text-sm sm:text-base">+{calculatePoints()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-foreground/60 text-base sm:text-lg">Subtotal</span>
                    <span className="font-bold text-foreground text-base sm:text-lg">
                      Rp {Number(total)?.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-base py-2.5 sm:py-3 mt-2"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Memproses...
                    </span>
                  ) : (
                    "Checkout Sekarang"
                  )}
                </Button>

                <Link 
                  href="/marketplace" 
                  className="text-primary hover:underline block text-center text-sm sm:text-base"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-1" />
                  Lanjut Belanja
                </Link>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
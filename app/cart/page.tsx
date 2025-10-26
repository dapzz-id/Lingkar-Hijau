"use client"

import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { Trash2, Plus, Minus, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function CartPage() {
  const { items, total, count, updateQuantity, removeItem, clear } = useCart()
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0) // State untuk menyimpan poin yang didapat

  const calculatePoints = () => {
    return items.reduce((totalPoints, item) => totalPoints + (item.quantity * 100), 0)
  }

  const handleCheckout = async () => {
    setIsProcessing(true)
    
    // Simpan poin yang akan didapat sebelum cart dikosongkan
    const pointsToEarn = calculatePoints()
    setEarnedPoints(pointsToEarn)
    
    try {
      // Hit API untuk checkout
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
        // Kosongkan cart dan tampilkan modal sukses
        clear()
        setIsCheckoutModalOpen(true)
      } else {
        alert(data.error || "Gagal melakukan checkout")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Terjadi kesalahan saat checkout")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Keranjang</h1>
          {items.length > 0 && (
            <Button variant="outline" onClick={clear} className="bg-transparent">
              Kosongkan Keranjang
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <Card className="p-8 text-center">
            {isCheckoutModalOpen ? (
              <div className="space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold text-foreground">Checkout Berhasil!</h2>
                <p className="text-foreground/70">
                  Terima kasih telah berbelanja. Anda mendapatkan {earnedPoints} poin!
                </p>
                <div className="flex gap-4 justify-center mt-6">
                  <Link href="/marketplace">
                    <Button className="bg-primary text-primary-foreground">
                      Lanjut Belanja
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline">
                      Lihat Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <p className="text-foreground/70 mb-6">Keranjang Anda kosong.</p>
                <Link href="/marketplace">
                  <Button className="bg-primary text-primary-foreground">Mulai Belanja</Button>
                </Link>
              </>
            )}
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {item.image ? (
                      item.image.startsWith("http") || item.image.startsWith("/") || item.image.startsWith("data:") ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-md object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className={`w-16 h-16 rounded-md ${item.image}`} />
                      )
                    ) : (
                      <div className="w-16 h-16 rounded-md bg-muted" />
                    )}
                    <div>
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-sm text-foreground/60">Rp {Number(item.price)?.toLocaleString('id-ID')}</p>
                      <p className="text-xs text-green-600 mt-1">
                        +{item.quantity * 100} poin
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => (item.quantity <= 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1))}
                        className="px-3 py-2 hover:bg-muted transition"
                        aria-label="Kurangi"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-semibold text-foreground min-w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-2 hover:bg-muted transition"
                        aria-label="Tambah"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">
                        Rp {Number(item.price * item.quantity)?.toLocaleString('id-ID')}
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Hapus
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div>
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground/60">Jumlah Item</span>
                  <span className="font-semibold text-foreground">{count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground/60">Total Poin</span>
                  <span className="font-semibold text-green-600">+{calculatePoints()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground/60">Subtotal</span>
                  <span className="font-bold text-foreground">Rp {Number(total)?.toLocaleString('id-ID')}</span>
                </div>
                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Memproses..." : "Checkout"}
                </Button>
                <Link href="/marketplace" className="text-sm text-primary hover:underline block text-center">
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
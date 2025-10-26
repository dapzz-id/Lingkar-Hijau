"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Upload, X } from "lucide-react"

const CATEGORIES = [
  "Fashion",
  "Lifestyle",
  "Kesehatan",
  "Gardening",
  "Elektronik",
  "Makanan",
  "Lainnya"
]

interface Product {
  id: number
  name: string
  description: string
  category: string
  price: number
  original_price: number
  eco_score: number
  image_url: string
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    original_price: "",
    eco_score: "",
    image_url: ""
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        const data = await response.json()
        if (response.ok) {
          setProduct(data.product)
          setFormData({
            name: data.product.name,
            description: data.product.description || "",
            category: data.product.category,
            price: data.product.price.toString(),
            original_price: data.product.original_price?.toString() || "",
            eco_score: data.product.eco_score?.toString() || "",
            image_url: data.product.image_url || ""
          })
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          image_url: data.imageUrl
        }))
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Gagal mengupload gambar")
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image_url: ""
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          original_price: formData.original_price ? parseFloat(formData.original_price) : null,
          eco_score: formData.eco_score ? parseInt(formData.eco_score) : null
        })
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/products')
      } else {
        alert(data.error || "Gagal mengupdate produk")
      }
    } catch (error) {
      console.error("Update product error:", error)
      alert("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Edit Produk</h1>
          <p className="text-foreground/60 mt-1">Ubah informasi produk Anda</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Gambar Produk
              </label>
              
              {formData.image_url ? (
                <div className="relative inline-block">
                  <img 
                    src={formData.image_url} 
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-foreground/40 mx-auto mb-2" />
                    <p className="text-foreground/60 mb-1">
                      {uploading ? "Mengupload..." : "Klik untuk upload gambar"}
                    </p>
                    <p className="text-sm text-foreground/40">
                      PNG, JPG, JPEG (max. 5MB)
                    </p>
                  </label>
                </div>
              )}
            </div>

            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Nama Produk *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama produk"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                Deskripsi Produk
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Deskripsikan produk Anda..."
                rows={4}
              />
            </div>

            {/* Category and Price */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                  Kategori *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-border rounded-md bg-background"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">
                  Harga (Rp) *
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Original Price and Eco Score */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="original_price" className="block text-sm font-medium text-foreground mb-2">
                  Harga Asli (Rp)
                </label>
                <Input
                  id="original_price"
                  name="original_price"
                  type="number"
                  value={formData.original_price}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label htmlFor="eco_score" className="block text-sm font-medium text-foreground mb-2">
                  Eco Score (0-100)
                </label>
                <Input
                  id="eco_score"
                  name="eco_score"
                  type="number"
                  value={formData.eco_score}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Update Produk"}
              </Button>
            </div>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
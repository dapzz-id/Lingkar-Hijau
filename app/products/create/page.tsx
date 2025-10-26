"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useRouter } from "next/navigation"
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

export default function CreateProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    original_price: "",
    eco_score: "",
    image_url: ""
  })
  const [imagePreview, setImagePreview] = useState<string>("")

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

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)

    setUploading(true)
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          image_url: data.imageUrl
        }))
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Gagal mengupload gambar. Pastikan file tidak terlalu besar dan formatnya sesuai.")
      // Remove preview if upload fails
      setImagePreview("")
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image_url: ""
    }))
    setImagePreview("")
    // Clear file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.category || !formData.price) {
      alert("Nama produk, kategori, dan harga harus diisi")
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
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
        alert(data.error || "Gagal membuat produk")
      }
    } catch (error) {
      console.error("Create product error:", error)
      alert("Terjadi kesalahan saat menyimpan produk")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/products')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Produk
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Tambah Produk Baru</h1>
          <p className="text-foreground/60 mt-1">Isi informasi produk Anda</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Gambar Produk
              </label>
              
              {(formData.image_url || imagePreview) ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img 
                      src={formData.image_url || imagePreview} 
                      alt="Preview"
                      className="w-48 h-48 object-cover rounded-lg border-2 border-border"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {formData.image_url && (
                    <p className="text-sm text-green-600">
                      ✓ Gambar berhasil diupload
                    </p>
                  )}
                  {imagePreview && !formData.image_url && (
                    <p className="text-sm text-yellow-600">
                      ⚠️ Gambar belum diupload ke server
                    </p>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer block">
                    <Upload className="w-12 h-12 text-foreground/40 mx-auto mb-4" />
                    <p className="text-foreground/60 mb-2 text-lg">
                      {uploading ? "Mengupload..." : "Klik untuk upload gambar"}
                    </p>
                    <p className="text-sm text-foreground/40">
                      Format: PNG, JPG, JPEG (max. 5MB)
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
                disabled={loading}
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
                disabled={loading}
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
                  className="w-full p-2 border border-border rounded-md bg-background disabled:opacity-50"
                  required
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/products')}
                className="flex-1"
                disabled={loading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading || uploading}
              >
                {loading ? "Menyimpan..." : uploading ? "Mengupload..." : "Simpan Produk"}
              </Button>
            </div>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
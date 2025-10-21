"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Upload,
  Zap,
  Leaf,
  Droplet,
  Medal as Metal,
  FileText,
  Lightbulb,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { classifyPlasticFromImage } from "@/lib/ai-classifier"

const wasteCategories = [
  { id: 1, name: "Plastik", icon: Leaf, description: "Botol, tas, kemasan plastik", tips: "Cuci bersih sebelum didaur ulang", color: "from-green-500 to-green-600" },
  { id: 2, name: "Organik", icon: Leaf, description: "Sisa makanan, daun, ranting", tips: "Bisa dijadikan kompos atau pupuk", color: "from-green-500 to-green-600" },
  { id: 3, name: "Logam", icon: Metal, description: "Kaleng, besi, aluminium", tips: "Pisahkan dari sampah lainnya", color: "from-green-500 to-green-600" },
  { id: 4, name: "Kertas", icon: FileText, description: "Kardus, koran, majalah", tips: "Jangan campur dengan sampah basah", color: "from-green-500 to-green-600" },
  { id: 5, name: "Kaca", icon: Droplet, description: "Botol kaca, gelas", tips: "Hati-hati saat menangani", color: "from-green-500 to-green-600" },
  { id: 6, name: "Elektronik", icon: Zap, description: "Baterai, charger, gadget lama", tips: "Bawa ke tempat daur ulang khusus", color: "from-green-500 to-green-600" },
]

export default function CatalogPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file terlalu besar (max 5MB)")
      return
    }

    setError(null)
    setScanResult(null)
    setIsLoading(true)

    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const imageData = event.target?.result as string
        setUploadedImage(imageData)

        const img = new Image()
        img.onload = async () => {
          try {
            const result = await classifyPlasticFromImage(img)
            setScanResult(result)
          } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal menganalisis gambar")
          } finally {
            setIsLoading(false)
          }
        }
        img.onerror = () => {
          setError("Gagal memuat gambar")
          setIsLoading(false)
        }
        img.crossOrigin = "anonymous"
        img.src = imageData
      }
      reader.readAsDataURL(file)
    } catch {
      setError("Gagal memproses gambar")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Katalog Sampah Pintar</h1>
          <p className="text-foreground/60">Scan sampah Anda dan dapatkan tips daur ulang yang tepat</p>
        </motion.div>

        {/* AI Scanner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="p-8 mb-12 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Upload Area */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  AI Scan Sampah
                </h2>

                <label className="block">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary/60 transition"
                  >
                    <Upload className="w-12 h-12 text-primary/60 mx-auto mb-4" />
                    <p className="font-semibold text-foreground mb-1">Upload Foto Sampah</p>
                    <p className="text-sm text-foreground/60">atau drag & drop di sini</p>
                    <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isLoading} />
                  </motion.div>
                </label>

                <AnimatePresence>
                  {uploadedImage && (
                    <motion.div
                      key="uploadedImage"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      <img src={uploadedImage} alt="Uploaded waste" className="w-full h-48 object-cover rounded-lg" />
                      <button
                        onClick={() => {
                          setUploadedImage(null)
                          setScanResult(null)
                          setError(null)
                        }}
                        className="text-sm text-primary hover:text-primary/80 mt-2"
                      >
                        Hapus Gambar
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Scan Result */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Hasil Analisis</h2>
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-6 bg-background border border-primary/20 rounded-lg flex flex-col items-center justify-center gap-3 py-8"
                    >
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <p className="text-foreground/70 font-medium">Menganalisis dengan AI...</p>
                      <p className="text-xs text-foreground/50">Memuat model (10–30 detik pertama kali)</p>
                    </motion.div>
                  ) : error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="p-6 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-red-900 dark:text-red-100 text-sm">Error</p>
                          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : scanResult ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="p-6 bg-background border border-primary/20 rounded-lg"
                    >
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-foreground/60 mb-1">Hasil Analisis</p>
                          <p className="text-2xl font-bold text-primary">{scanResult.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60 mb-1">Confidence</p>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <motion.div
                              className="bg-primary h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${scanResult.confidence}%` }}
                              transition={{ duration: 0.8 }}
                            />
                          </div>
                          <p className="text-sm text-foreground/60 mt-1 mb-4">{scanResult.confidence.toFixed(0)}%</p>
                          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-semibold text-foreground text-sm mb-2">Tips Daur Ulang</p>
                                <ul className="space-y-1"> {scanResult.tips.map((tip: string, idx: number) => (
                                  <li key={idx} className="text-sm text-foreground/70 flex gap-2">
                                    <span className="text-accent font-bold">{idx + 1}.</span>
                                    <span>{tip}</span>
                                  </li>))}
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-foreground/50 pt-2 border-t border-border"> Kategori: {scanResult.category} </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 bg-muted/30 border border-border/50 text-center rounded-lg"
                    >
                      <p className="text-foreground/60">Upload foto untuk melihat hasil analisis</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Waste Categories */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Kategori Sampah</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wasteCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.03, y: -5 }}
                  transition={{ type: "spring", stiffness: 250, damping: 15 }}
                >
                  <Card
                    onClick={() => setSelectedCategory(category)}
                    className={`p-6 cursor-pointer transition-all ${selectedCategory?.id === category.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                      }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{category.name}</h3>
                    <p className="text-sm text-foreground/60 mb-3">{category.description}</p>
                    <p className="text-xs text-foreground/50 italic">{category.tips}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Edit, Trash2, Eye, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Product {
  id: number
  seller_id: number
  name: string
  description: string
  category: string
  price: number
  original_price: number
  eco_score: number
  image_url: string
  rating: number
  reviews_count: number
  created_at: string
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Gagal memuat data produk");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId: number) => {
    router.push(`/products/edit/${productId}`);
  }

  const handleDelete = async (productId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // Remove product from state
          setProducts(prev => prev.filter(product => product.id !== productId));
          alert("Produk berhasil dihapus");
        } else {
          const data = await response.json();
          alert(data.error || "Gagal menghapus produk");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Terjadi kesalahan saat menghapus produk");
      }
    }
  }

  const handleView = (productId: number) => {
    router.push(`/marketplace/${productId}`);
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Produk Saya</h1>
                <p className="text-foreground/60 mt-1">Kelola produk yang Anda jual</p>
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                + Tambah Produk Baru
              </Button>
            </div>
            
            {/* Loading Skeleton */}
            <Card className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-4 py-4 border-b border-border/50">
                    <div className="w-12 h-12 bg-muted rounded-lg animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse w-1/3"></div>
                      <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
                    </div>
                    <div className="h-8 bg-muted rounded animate-pulse w-24"></div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Produk Saya</h1>
                <p className="text-foreground/60 mt-1">Kelola produk yang Anda jual</p>
              </div>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90"  
                onClick={() => router.push('/products/create')}
              >
                + Tambah Produk Baru
              </Button>
            </div>
            
            <Card className="p-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Terjadi Kesalahan</h3>
                <p className="text-foreground/60 mb-4">{error}</p>
                <Button 
                  onClick={fetchProducts}
                  className="bg-primary text-primary-foreground"
                >
                  Coba Lagi
                </Button>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Produk Saya</h1>
                <p className="text-foreground/60 mt-1">Kelola produk yang Anda jual</p>
              </div>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90"  
                onClick={() => router.push('/products/create')}
              >
                + Tambah Produk Baru
              </Button>
            </div>

            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground/70">Produk</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground/70">Kategori</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground/70">Harga</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground/70">Eco Score</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground/70">Rating</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground/70">Tanggal</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground/70">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              {product.image_url ? (
                                <img 
                                  src={product.image_url} 
                                  alt={product.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <span className="text-xs text-primary font-semibold">ECO</span>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate max-w-[200px]">
                                {product.name}
                              </p>
                              <p className="text-sm text-foreground/60 truncate max-w-[200px]">
                                {product.description || "Tidak ada deskripsi"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {product.category || "Tidak ada kategori"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <p className="font-semibold text-foreground">
                              {formatPrice(product.price)}
                            </p>
                            {product.original_price && product.original_price > product.price && (
                              <p className="text-sm text-foreground/60 line-through">
                                {formatPrice(product.original_price)}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${product.eco_score || 0}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {product.eco_score || 0}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <span className="text-yellow-400">★</span>
                              <span className="ml-1 text-sm font-medium text-foreground">
                                {product.rating || 0}
                              </span>
                            </div>
                            <span className="text-sm text-foreground/60">
                              ({product.reviews_count || 0})
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-foreground/70">
                          {formatDate(product.created_at)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(product.id)}
                              className="h-8 w-8 p-0 hover:bg-primary/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                              className="h-8 w-8 p-0 hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-muted"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleView(product.id)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Lihat Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Produk
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(product.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Hapus Produk
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {products.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📦</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Belum ada produk</h3>
                  <p className="text-foreground/60 mb-4">Mulai jual produk eco-friendly Anda sekarang</p>
                  <Button 
                    className="bg-primary text-primary-foreground"
                    onClick={() => router.push('/products/create')}
                  >
                    + Tambah Produk Pertama
                  </Button>
                </div>
              )}
            </Card>

            <div className="flex justify-between items-center text-sm text-foreground/60">
              <span>Menampilkan {products.length} produk</span>
              <Link href="/marketplace" className="text-primary hover:underline">
                Lihat marketplace →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
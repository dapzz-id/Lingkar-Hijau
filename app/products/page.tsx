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
        <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Produk Saya</h1>
                <p className="text-foreground/60 mt-1 text-sm sm:text-base">Kelola produk yang Anda jual</p>
              </div>
              <Button className="bg-primary btn-default hover:bg-primary/90 w-full sm:w-auto">
                + Tambah Produk Baru
              </Button>
            </div>
            
            {/* Loading Skeleton */}
            <Card className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-3 sm:gap-4 py-3 sm:py-4 border-b border-border/50">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg animate-pulse"></div>
                    <div className="flex-1 space-y-1.5 sm:space-y-2">
                      <div className="h-3.5 sm:h-4 bg-muted rounded animate-pulse w-1/2 sm:w-1/3"></div>
                      <div className="h-3 bg-muted rounded animate-pulse w-2/3 sm:w-1/2"></div>
                    </div>
                    <div className="h-7 sm:h-8 bg-muted rounded animate-pulse w-16 sm:w-24"></div>
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
        <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Produk Saya</h1>
                <p className="text-foreground/60 mt-1 text-sm sm:text-base">Kelola produk yang Anda jual</p>
              </div>
              <Button 
                className="bg-primary btn-default hover:bg-primary/90 w-full sm:w-auto"  
                onClick={() => router.push('/products/create')}
              >
                + Tambah Produk Baru
              </Button>
            </div>
            
            <Card className="p-4 sm:p-6">
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl">⚠️</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5 sm:mb-2">Terjadi Kesalahan</h3>
                <p className="text-foreground/60 mb-3 sm:mb-4 text-sm sm:text-base">{error}</p>
                <Button 
                  onClick={fetchProducts}
                  className="bg-primary text-primary-foreground w-full sm:w-auto"
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

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid gap-4 sm:gap-6">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Produk Saya</h1>
                <p className="text-foreground/60 mt-1 text-sm sm:text-base">Kelola produk yang Anda jual</p>
              </div>
              <Button 
                className="bg-primary btn-default hover:bg-primary/90 w-full sm:w-auto"  
                onClick={() => router.push('/products/create')}
              >
                + Tambah Produk Baru
              </Button>
            </div>

            {/* Desktop Table */}
            <Card className="p-4 sm:p-6 hidden lg:block">
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
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
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
                            <div className="min-w-0 flex-1">
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
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(product.id)}
                              className="btn-action hover:bg-primary/10"
                            >
                              <Edit className="ic-action" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                              className="btn-action hover:bg-destructive/10"
                            >
                              <Trash2 className="ic-action text-destructive" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(product.id)}
                              className="btn-action hover:bg-destructive/10"
                            >
                              <Eye className="ic-action" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {products.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl">📦</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5 sm:mb-2">Belum ada produk</h3>
                  <p className="text-foreground/60 mb-3 sm:mb-4 text-sm sm:text-base">Mulai jual produk eco-friendly Anda sekarang</p>
                  <Button 
                    className="bg-primary btn-default w-full sm:w-auto"
                    onClick={() => router.push('/products/create')}
                  >
                    + Tambah Produk Pertama
                  </Button>
                </div>
              )}
            </Card>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3">
              {products.map((product) => (
                <Card key={product.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    {/* Product Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
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
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                          <p className="text-xs text-foreground/60 truncate">
                            {product.description || "Tidak ada deskripsi"}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                            className="hover:text-white"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus Produk
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Product Details */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-foreground/60">Kategori</span>
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {product.category || "Tidak ada kategori"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-foreground/60">Harga</span>
                        <div className="mt-1">
                          <p className="font-semibold text-foreground">
                            {formatPrice(product.price)}
                          </p>
                          {product.original_price && product.original_price > product.price && (
                            <p className="text-xs text-foreground/60 line-through">
                              {formatPrice(product.original_price)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-foreground/60">Eco Score</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-12 bg-muted rounded-full h-1.5 flex-1">
                            <div 
                              className="bg-green-500 h-1.5 rounded-full"
                              style={{ width: `${product.eco_score || 0}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-foreground">
                            {product.eco_score || 0}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-foreground/60">Rating</span>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-yellow-400 text-sm">★</span>
                          <span className="text-sm font-medium text-foreground">
                            {product.rating || 0}
                          </span>
                          <span className="text-xs text-foreground/60">
                            ({product.reviews_count || 0})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Date and Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <span className="text-xs text-foreground/60">
                        {formatDate(product.created_at)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product.id)}
                          className="h-7 w-7 p-0 hover:bg-primary/10"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="h-7 w-7 p-0 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Empty State for Mobile */}
            {products.length === 0 && (
              <Card className="p-4 sm:p-6 lg:hidden">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">📦</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1.5">Belum ada produk</h3>
                  <p className="text-foreground/60 mb-3 text-sm">Mulai jual produk eco-friendly Anda sekarang</p>
                  <Button 
                    className="bg-primary btn-default w-full"
                    onClick={() => router.push('/products/create')}
                  >
                    + Tambah Produk Pertama
                  </Button>
                </div>
              </Card>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-foreground/60">
              <span className="text-center sm:text-left">Menampilkan {products.length} produk</span>
              <Link href="/marketplace" className="text-primary hover:underline text-sm">
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
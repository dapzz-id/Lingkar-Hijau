"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2, ShoppingCart, Star } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"

type Product = {
  id: string
  name: string
  price: number
  original_price?: number
  eco_score?: string | number | null
  seller_id?: string | number
  seller_name?: string
  image_url?: string
  rating?: number | string | null
  reviews_count?: number
  description?: string
  reviews?: Array<{
    id: string
    id_products: string
    id_seller: string
    id_buyer: string
    comment_buyer: string
    reply_comment_by_seller: string | null
    created_at: string
    seller_name: string
    seller_avatar: string | null
    buyer_name: string
    buyer_avatar: string | null
    count_rate: number
  }>
}

export default function Page() {
  const params = useParams<{ id: string }>()
  const [quantity, setQuantity] = useState<number>(1)
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("description")
  const { addItem } = useCart()
  const [productData, setProductData] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [userCanReview, setUserCanReview] = useState<boolean>(false)
  const [hasReviewed, setHasReviewed] = useState<boolean>(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [userReview, setUserReview] = useState<{ comment_buyer: string; count_rate: number } | null>(null)
  const [newComment, setNewComment] = useState<string>("")
  const [newRating, setNewRating] = useState<number>(0)
  const { user, loading: authLoading } = useAuth()
  const [replyText, setReplyText] = useState<string>("")
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)

  const getRatingNumber = (rating: number | string | null | undefined): number => {
    if (rating === null || rating === undefined) return 0
    if (typeof rating === 'number') return rating
    if (typeof rating === 'string') {
      const num = parseFloat(rating)
      return isNaN(num) ? 0 : num
    }
    return 0
  }

  const formatRating = (rating: number | string | null | undefined): string => {
    const num = getRatingNumber(rating)
    return num > 0 ? num.toFixed(1) : "0.0"
  }

  const getIntegerRating = (rating: number | string | null | undefined): number => {
    return Math.floor(getRatingNumber(rating))
  }

  const isSeller = user && productData && user.id === productData.seller_id;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/marketplace/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch product")
        const data = (await response.json()) as { data: Product; error?: string }
        if (data.error) throw new Error(data.error)
        setProductData(data.data)
      } catch (err) {
        console.error("Error fetching product data:", err)
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }
    if (params?.id) {
      fetchProductData()
    }
  }, [params?.id])

  useEffect(() => {
    const checkPurchase = async () => {
      try {
        if (authLoading || !user) {
          console.log("Auth loading or no user:", { authLoading, user })
          setUserCanReview(false)
          setHasReviewed(false)
          return
        }

        const response = await fetch(`/api/check-purchase?product_id=${params.id}`)
        if (!response.ok) throw new Error(`Failed to check purchase (status: ${response.status})`)
        const result = await response.json()
        console.log("Check purchase response:", result)
        
        setUserCanReview(result.canReview)
        setHasReviewed(result.hasReviewed)
        setTransactionId(result.transactionId)
        
        if (result.hasReviewed) {
          setUserReview({ 
            comment_buyer: result.comment_buyer || "", 
            count_rate: result.count_rate || 0 
          })
          setNewComment(result.comment_buyer || "")
          setNewRating(result.count_rate || 0)
        } else {
          setNewComment("")
          setNewRating(0)
        }
      } catch (err) {
        console.error("Error checking purchase:", err)
        setUserCanReview(false)
        setHasReviewed(false)
      }
    }
    if (params?.id && user) {
      checkPurchase()
    }
  }, [params?.id, authLoading, user])

  const handleSubmitReview = async () => {
    try {
      if (authLoading || !user) {
        alert("Anda harus login untuk memberikan ulasan");
        return;
      }

      if (!transactionId) {
        alert("Transaction ID tidak ditemukan");
        return;
      }

      if (newRating === 0) {
        alert("Silakan berikan rating terlebih dahulu");
        return;
      }

      console.log("Submitting review:", {
        productId: params.id,
        comment: newComment,
        rating: newRating,
        transactionId: transactionId,
        hasReviewed: hasReviewed,
      });

      const response = await fetch(`/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: params.id,
          comment: newComment,
          rating: newRating,
          transactionId: transactionId,
          hasReviewed: hasReviewed,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit review");
      }
      
      const result = await response.json();
      if (result.refresh){
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
      console.log("Review submitted successfully:", result);
      
      const fetchProductData = async () => {
        const response = await fetch(`/api/marketplace/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProductData(data.data);
        }
      };
      await fetchProductData();
      
      setHasReviewed(true);
      alert(hasReviewed ? "Ulasan berhasil diperbarui!" : "Ulasan berhasil dikirim!");
      
    } catch (err) {
      console.error("Error submitting review:", err);
      alert(err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim ulasan");
    }
  }

  const handleSubmitReply = async (reviewId: string) => {
    try {
      if (authLoading || !user || !isSeller) {
        alert("Hanya seller yang dapat membalas ulasan");
        return;
      }

      if (!replyText.trim()) {
        alert("Balasan tidak boleh kosong");
        return;
      }

      console.log("Submitting reply:", { reviewId, reply: replyText, productId: params.id });

      const response = await fetch(`/api/reviews`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId,
          reply: replyText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit reply");
      }

      const result = await response.json();
      console.log("Reply submitted successfully:", result);

      const fetchProductData = async () => {
        const response = await fetch(`/api/marketplace/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProductData(data.data);
        }
      };
      await fetchProductData();

      setReplyText("");
      setSelectedReviewId(null);
      alert("Balasan berhasil dikirim!");
    } catch (err) {
      console.error("Error submitting reply:", err);
      alert(err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim balasan");
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productData?.name,
          text: productData?.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link produk berhasil disalin ke clipboard!')
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-foreground/60">Memuat produk...</p>
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
          <div className="text-center py-20">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Terjadi Kesalahan</h2>
            <p className="text-foreground/60 mb-6">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Coba Lagi
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!productData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="text-foreground/40 text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Produk Tidak Ditemukan</h2>
            <p className="text-foreground/60 mb-6">Produk yang Anda cari tidak ditemukan.</p>
            <Button 
              onClick={() => window.history.back()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Kembali
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const discount = productData.original_price
    ? Math.round(((productData.original_price - productData.price) / productData.original_price) * 100)
    : 0

  const ratingNumber = getRatingNumber(productData.rating)
  const integerRating = getIntegerRating(productData.rating)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-xs sm:text-sm text-foreground/60 mb-4 sm:mb-6 md:mb-8 overflow-x-auto"
        >
          <a href="/marketplace" className="hover:text-foreground transition whitespace-nowrap">
            Marketplace
          </a>
          <span>/</span>
          <span className="text-foreground whitespace-nowrap truncate max-w-[150px] sm:max-w-none">
            {productData.name}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12"
        >
          <div className="h-64 sm:h-80 md:h-96 bg-muted flex items-center justify-center text-foreground/40 rounded-lg overflow-hidden">
            {productData.image_url ? (
              <img 
                src={productData.image_url} 
                alt={productData.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-sm">No image available</p>
              </div>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 wrap-break-word">
                    {productData.name}
                  </h1>
                  <span className="text-primary text-xs sm:text-sm font-medium">
                    Seller: {productData.seller_name || "Unknown"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4 flex-wrap">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm sm:text-lg ${
                          i < integerRating ? "text-yellow-500" : "text-foreground/20"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="font-semibold text-foreground text-sm sm:text-base">
                    {formatRating(productData.rating)}
                  </span>
                </div>
                <span className="text-foreground/60 text-xs sm:text-sm">
                  ({productData.reviews_count || 0} ulasan)
                </span>
              </div>
            </div>

            <Card className="p-3 sm:p-4 bg-card border-border">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold text-primary">
                    Rp {Number(productData.price)?.toLocaleString("id-ID") || "0"}
                  </span>
                  {productData.original_price && productData.original_price > productData.price && (
                    <>
                      <span className="text-base sm:text-lg text-foreground/40 line-through">
                        Rp {Number(productData.original_price)?.toLocaleString("id-ID")}
                      </span>
                      <span className="px-2 py-1 bg-red-500/20 text-red-600 rounded text-xs sm:text-sm font-semibold">
                        -{discount}%
                      </span>
                    </>
                  )}
                </div>
                {productData.original_price && productData.original_price > productData.price && (
                  <p className="text-xs sm:text-sm text-green-600 font-semibold">
                    Hemat Rp {(Number(productData.original_price - productData.price) || 0).toLocaleString("id-ID")}
                  </p>
                )}
              </div>
            </Card>

            {productData.eco_score && (
              <Card className="p-3 sm:p-4 bg-card border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-foreground mb-2 sm:mb-3 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🌱</span> Eco Score
                </h3>
                <p className="font-bold text-green-600 text-sm sm:text-base">
                  {productData.eco_score}/100
                </p>
              </Card>
            )}

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-foreground/60 text-sm sm:text-base">Jumlah:</span>
                <div className="flex items-center border border-border rounded-lg bg-card">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 sm:px-3 py-1 sm:py-2 hover:bg-accent transition text-sm sm:text-base text-foreground/60 hover:text-foreground cursor-pointer"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-3 sm:px-4 py-1 sm:py-2 font-semibold text-foreground text-sm sm:text-base min-w-10 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 sm:px-3 py-1 sm:py-2 hover:bg-accent transition text-sm sm:text-base text-foreground/60 hover:text-foreground cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 flex-col sm:flex-row">
                <Button
                  onClick={() => {
                    addItem(
                      {
                        id: Number(productData.id),
                        name: productData.name,
                        price: productData.price || 0,
                        image: productData.image_url || "",
                      },
                      quantity
                    )
                    alert("Produk berhasil ditambahkan ke keranjang!")
                  }}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base py-3 sm:py-6 cursor-pointer btn-default"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  Tambah ke Keranjang
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-4 sm:px-6 bg-card py-3 sm:py-6 btn-default hover:text-white"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8 sm:mb-10 md:mb-12"
        >
          <div className="flex gap-2 sm:gap-4 border-b border-border mb-4 sm:mb-6 overflow-x-auto">
            {["description", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm whitespace-nowrap border-b-2 transition ${
                  activeTab === tab
                    ? "border-primary text-primary cursor-pointer"
                    : "border-transparent text-foreground/60 hover:text-foreground btn-default"
                }`}
              >
                {tab === "description" && "Deskripsi"}
                {tab === "reviews" && `Ulasan (${productData.reviews_count || 0})`}
              </button>
            ))}
          </div>

          <div>
            {activeTab === "description" && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
                    Deskripsi Produk
                  </h3>
                  <p className="text-foreground/60 leading-relaxed text-sm sm:text-base">
                    {productData.description || "Tidak ada deskripsi produk."}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">
                  Ulasan Produk ({productData.reviews_count || 0})
                </h3>
                
                {productData.reviews && productData.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {productData.reviews.map((review) => (
                      <Card key={review.id} className="p-4 sm:p-6 bg-card border-border">
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full">
                                {review.buyer_avatar ? (
                                  <img
                                    src={review.buyer_avatar}
                                    alt={review.buyer_name}
                                    className="w-8 aspect-square rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                                    {review.buyer_name?.charAt(0).toUpperCase() || "P"}
                                  </span>
                                )}
                              </div>

                              <span className="font-semibold text-foreground text-sm sm:text-base">
                                {review.buyer_name || "Anonymous"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-sm ${
                                      i < (review.count_rate || 0) ? "text-yellow-500" : "text-foreground/20"
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-foreground/40 text-xs">
                                {new Date(review.created_at).toLocaleDateString("id-ID", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-foreground/60 text-sm sm:text-base mt-2">
                            {review.comment_buyer || "Tidak ada komentar"}
                          </p>
                          
                          {review.reply_comment_by_seller && (
                            <div className="mt-3 p-4 bg-accent/10 rounded-lg border-l-4 border-primary">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full">
                                  {review.seller_avatar ? (
                                    <img
                                      src={review.seller_avatar}
                                      alt={review.seller_name}
                                      className="w-8 aspect-square rounded-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                                      {review.seller_name?.charAt(0).toUpperCase() || "P"}
                                    </span>
                                  )}
                                </div>
                                
                                <span className="font-semibold text-foreground text-base max-md:text-sm">
                                  {review.seller_name}
                                </span>
                              </div>
                              <p className="text-foreground/80 text-sm">
                                {review.reply_comment_by_seller}
                              </p>
                            </div>
                          )}

                          {isSeller && (
                            <div className="mt-3">
                              <textarea
                                className="w-full p-4 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                rows={2}
                                placeholder="Tulis balasan untuk ulasan ini..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                disabled={selectedReviewId !== review.id}
                              />
                              <div className="flex gap-2 mt-2">
                                {selectedReviewId === review.id ? (
                                  <>
                                    <Button
                                      onClick={() => handleSubmitReply(review.id)}
                                      className="bg-primary hover:bg-primary/90 hover:text-white cursor-pointer text-white text-sm"
                                    >
                                      {review.reply_comment_by_seller ? "Update Ulasan" : "Kirim Balasan"}
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setReplyText("");
                                        setSelectedReviewId(null);
                                      }}
                                      className="text-sm hover:text-white cursor-pointer"
                                    >
                                      Batal
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    onClick={() => {
                                      console.log("Opening reply for review:", review.id);
                                      setSelectedReviewId(review.id);
                                      if (review.reply_comment_by_seller) {
                                        setReplyText(review.reply_comment_by_seller);
                                      }
                                    }}
                                    variant="outline"
                                    className="text-sm hover:text-white cursor-pointer"
                                  >
                                    {review.reply_comment_by_seller ? "Update Ulasan" : "Balas Ulasan"}
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-6 text-center bg-card border-border">
                    <div className="text-foreground/40 text-4xl mb-3">💬</div>
                    <p className="text-foreground/60">Belum ada ulasan untuk produk ini.</p>
                    <p className="text-foreground/40 text-sm mt-1">Jadilah yang pertama memberikan ulasan!</p>
                  </Card>
                )}
                
                {user && (
                  <Card className="p-4 sm:p-6 bg-card border-border mt-6">
                    <h4 className="font-semibold text-foreground mb-4 text-sm sm:text-base">
                      {hasReviewed ? "Edit Ulasan Anda" : "Tambah Ulasan"}
                    </h4>
                    
                    {!userCanReview ? (
                      <div className="text-center py-4">
                        <div className="text-foreground/40 text-3xl mb-2">🔒</div>
                        <p className="text-foreground/60 text-sm">
                          Anda hanya dapat memberikan ulasan setelah membeli produk ini.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Rating {newRating > 0 && `(${newRating}/5)`}
                          </label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewRating(star)}
                                className="p-1 hover:scale-110 transition-transform"
                              >
                                <Star
                                  className={`w-6 h-6 sm:w-8 sm:h-8 ${
                                    star <= newRating 
                                      ? "text-yellow-500 fill-yellow-500" 
                                      : "text-foreground/20"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Komentar {hasReviewed && "(Opsional)"}
                          </label>
                          <textarea
                            className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                            rows={4}
                            placeholder={hasReviewed ? "Update komentar Anda..." : "Bagikan pengalaman Anda dengan produk ini..."}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                        </div>
                        
                        <Button 
                          onClick={handleSubmitReview}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto hover:text-white cursor-pointer"
                          disabled={newRating === 0}
                        >
                          {hasReviewed ? "Update Ulasan" : "Kirim Ulasan"}
                        </Button>
                        
                        {newRating === 0 && (
                          <p className="text-red-500 text-sm">
                            Silakan berikan rating terlebih dahulu
                          </p>
                        )}
                      </div>
                    )}
                  </Card>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
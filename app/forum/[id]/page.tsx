"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, ThumbsUp, MessageCircle, ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { motion } from "framer-motion"
import Link from "next/link"

interface ThreadDetail {
  id: number
  title: string
  category: string
  content: string
  views: number
  replies_count: number
  likes: number
  created_at: string
  updated_at: string
  author_id: number
  is_liked?: boolean
}

interface Reply {
  id: number
  thread_id: number
  author_id: number
  author_name: string
  author_city: string
  content: string
  likes: number
  created_at: string
}

export default function ThreadDetailPage() {
  const params = useParams<{ id: string }>()
  const [thread, setThread] = useState<ThreadDetail | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newReply, setNewReply] = useState("")
  const [page, setPage] = useState(1)
  const [totalReplies, setTotalReplies] = useState(0)
  const [isLiking, setIsLiking] = useState(false)
  const limit = 10
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    const fetchThreadDetail = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/forum/threads/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch thread detail")
        const data = await response.json()
        if (data.error) throw new Error(data.error)
        setThread(data.thread)
        setTotalReplies(data.thread.replies_count || 0)
      } catch (err) {
        console.error("Error fetching thread detail:", err)
        setError(err instanceof Error ? err.message : "Thread not found or server error")
      } finally {
        setLoading(false)
      }
    }

    const updateViewsIfNeeded = async () => {
      const hasVisited = sessionStorage.getItem(`viewed_${params.id}`);
      if (!hasVisited) {
        try {
          console.log(`Updating views for thread ${params.id}`); // Debugging
          const response = await fetch(`/api/forum/threads/${params.id}`, {
            method: "POST",
          });
          if (!response.ok) throw new Error("Failed to update views");
          console.log(`Views updated for thread ${params.id}`);
          sessionStorage.setItem(`viewed_${params.id}`, "true");
          // Refresh thread data setelah update views
          const refreshResponse = await fetch(`/api/forum/threads/${params.id}`);
          const refreshData = await refreshResponse.json();
          setThread(refreshData.thread);
        } catch (err) {
          console.error("Error updating views:", err);
        }
      } else {
        console.log(`Thread ${params.id} already viewed, skipping update`);
      }
    };

    if (params?.id) {
      fetchThreadDetail();
      updateViewsIfNeeded();
    }
  }, [params?.id]);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await fetch(`/api/forum/replies?thread_id=${params.id}&page=${page}&limit=${limit}`)
        if (!response.ok) throw new Error("Failed to fetch replies")
        const data = await response.json()
        if (data.error) throw new Error(data.error)
        setReplies(data.replies || [])
      } catch (err) {
        console.error("Error fetching replies:", err)
        setError(err instanceof Error ? err.message : "Failed to load replies")
      }
    }

    if (params?.id && page) {
      fetchReplies()
    }
  }, [params?.id, page])

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (authLoading || !user) {
      setError("Please log in to reply")
      return
    }

    try {
      const response = await fetch("/api/forum/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thread_id: params.id,
          author_id: user.id,
          content: newReply,
          likes: 0,
        }),
      })

      if (!response.ok) throw new Error("Failed to post reply")
      const data = await response.json()
      setReplies([data, ...replies])
      setNewReply("")
      setTotalReplies(totalReplies + 1)
      const refreshResponse = await fetch(`/api/forum/threads/${params.id}`)
      const refreshData = await refreshResponse.json()
      setThread(refreshData.thread)
    } catch (err) {
      console.error("Error posting reply:", err)
      setError(err instanceof Error ? err.message : "Failed to post reply")
    }
  }

  const handleLike = async () => {
    if (authLoading || !user) {
      setError("Please log in to like");
      return;
    }

    if (isLiking || !thread) return; // Prevent multiple clicks

    try {
      setIsLiking(true);

      const currentLikes = thread.likes || 0;
      const isCurrentlyLiked = thread.is_liked;

      const likeKey = `liked_thread_${thread.id}_user_${user.id}`;
      const newLikeCount = isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1;

      setThread(prev =>
        prev
          ? {
              ...prev,
              likes: newLikeCount,
              is_liked: !isCurrentlyLiked,
            }
          : null
      );

      if (!isCurrentlyLiked) {
        localStorage.setItem(likeKey, "true");
      } else {
        localStorage.removeItem(likeKey);
      }

      const response = await fetch(`/api/forum/threads/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          action: isCurrentlyLiked ? "unlike" : "like",
        }),
      });

      if (!response.ok) {
        setThread(prev =>
          prev
            ? {
                ...prev,
                likes: currentLikes,
                is_liked: isCurrentlyLiked,
              }
            : null
        );

        if (isCurrentlyLiked) {
          localStorage.setItem(likeKey, "true");
        } else {
          localStorage.removeItem(likeKey);
        }

        throw new Error("Failed to update likes");
      }

      const data = await response.json();

      setThread(prev =>
        prev
          ? {
              ...prev,
              likes: data.likes,
              is_liked: data.is_liked,
            }
          : null
      );
    } catch (err) {
      console.error("Error liking thread:", err);
      setError(err instanceof Error ? err.message : "Failed to like thread");
    } finally {
      setIsLiking(false);
    }
  };

  const handleNextPage = () => {
    if (page * limit < totalReplies) setPage(page + 1)
  }

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1)
  }

  if (loading || authLoading) return <div className="text-center py-10 text-gray-600">Loading...</div>
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>
  if (!thread) return <div className="text-center py-10 text-gray-600">Thread not found</div>

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Back Button */}
        <Link href="/forum" className="flex items-center gap-2 text-sm btn-default mb-6 sm:mb-8">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Forum
        </Link>

        {/* Thread Content */}
        <article className="mb-8 sm:mb-12">
          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded mb-2 sm:mb-3 inline-block">
            {thread.category}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
            {thread.title}
          </h1>
          
          <div 
            className="text-foreground/80 mb-4 sm:mb-6 prose prose-sm sm:prose-base max-w-none wrap-break-word"
            dangerouslySetInnerHTML={{ __html: thread.content }} 
          />
          
          {/* Thread Stats */}
          <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 text-foreground/60 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{thread.views} Dilihat</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{thread.replies_count} Balasan</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {/* Like Button - Clickable Icon */}
              <button
                onClick={handleLike}
                disabled={isLiking || authLoading || !user}
                className={`flex items-center gap-1.5 sm:gap-2 transition-all duration-200 ${
                  isLiking ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'
                } ${
                  thread.is_liked 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-foreground/60 hover:text-foreground/80'
                }`}
              >
                <ThumbsUp 
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-all ${
                    thread.is_liked ? 'fill-current' : ''
                  }`} 
                />
                <span>{thread.likes} Suka</span>
              </button>
            </div>
          </div>
        </article>

        {/* Replies Section */}
        <section className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
            Balasan ({totalReplies})
          </h2>
          
          {/* Replies List */}
          {replies.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {replies.map((reply) => (
                <Card key={reply.id} className="p-3 sm:p-4">
                  <p className="text-foreground mb-2 sm:mb-3 text-sm sm:text-base wrap-break-word">
                    {reply.content}
                  </p>
                  <div className="flex flex-col xs:justify-between gap-1 xs:gap-2 text-foreground/60 text-xs sm:text-sm">
                    <span className="wrap-break-word">
                      {reply.author_name}
                    </span>
                    
                    <span className="shrink-0">
                      {new Date(reply.created_at).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <MessageCircle className="w-12 h-12 text-foreground/30 mx-auto mb-3" />
              <p className="text-foreground/60 text-sm sm:text-base">Belum ada balasan.</p>
              <p className="text-foreground/40 text-xs sm:text-sm mt-1">Jadilah yang pertama membalas!</p>
            </Card>
          )}

          {/* Pagination */}
          {totalReplies > limit && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
              <Button 
                onClick={handlePrevPage} 
                disabled={page === 1} 
                variant="outline"
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Sebelumnya
              </Button>
              <span className="text-foreground/60 text-sm text-center order-1 sm:order-2">
                Halaman {page} dari {Math.ceil(totalReplies / limit)}
              </span>
              <Button 
                onClick={handleNextPage} 
                disabled={page * limit >= totalReplies} 
                variant="outline"
                className="w-full sm:w-auto order-3"
              >
                Selanjutnya
              </Button>
            </div>
          )}

          {/* Reply Form */}
          <form onSubmit={handleSubmitReply} className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
            <div className="relative">
              <Input
                placeholder="Tambah balasan..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                required
                className="w-full pr-20 text-sm sm:text-base"
              />
              {newReply && (
                <button
                  type="button"
                  onClick={() => setNewReply("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground/60 text-sm"
                >
                  Clear
                </button>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 btn-default text-sm sm:text-base py-2 sm:py-3"
              disabled={!newReply.trim()}
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Kirim Balasan
            </Button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  )
}
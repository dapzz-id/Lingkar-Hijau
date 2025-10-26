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

    try {
      const action = thread?.likes && thread.likes > 0 ? "unlike" : "like";
      const response = await fetch(`/api/forum/threads/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) throw new Error("Failed to update likes");
      const data = await response.json();
      setThread((prev) => prev ? { ...prev, likes: data.likes } : null);
    } catch (err) {
      console.error("Error liking thread:", err);
      setError(err instanceof Error ? err.message : "Failed to like thread");
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/forum" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Forum
        </Link>

        <article className="mb-12">
          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded mb-2 inline-block">{thread.category}</span>
          <h1 className="text-4xl font-bold text-foreground mb-4">{thread.title}</h1>
          <div className="text-foreground/80 mb-6 prose max-w-none" dangerouslySetInnerHTML={{ __html: thread.content }} />
          <div className="flex gap-6 text-foreground/60 text-sm">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {thread.views} Dilihat
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {thread.replies_count} Balasan
            </div>
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-5 h-5" />
              {thread.likes} Suka
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className="ml-2 p-1 h-auto"
              >
                {thread.likes && thread.likes > 0 ? "Unlike" : "Like"}
              </Button>
            </div>
          </div>
        </article>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Balasan ({totalReplies})</h2>
          {replies.length > 0 ? (
            replies.map((reply) => (
              <Card key={reply.id} className="p-4">
                <p className="text-foreground mb-2">{reply.content}</p>
                <div className="flex justify-between text-foreground/60 text-sm">
                  <span>{reply.author_name} ({reply.author_city ?? "Kota tidak diketahui"})</span>
                  <span>{new Date(reply.created_at).toLocaleString()}</span>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-foreground/60">Belum ada balasan.</p>
          )}

          <div className="flex justify-between items-center mt-6">
            <Button onClick={handlePrevPage} disabled={page === 1} variant="outline">
              Sebelumnya
            </Button>
            <span className="text-foreground/60">Halaman {page} dari {Math.ceil(totalReplies / limit)}</span>
            <Button onClick={handleNextPage} disabled={page * limit >= totalReplies} variant="outline">
              Selanjutnya
            </Button>
          </div>

          <form onSubmit={handleSubmitReply} className="mt-8 space-y-4">
            <Input
              placeholder="Tambah balasan..."
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              required
              className="w-full"
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <MessageCircle className="w-5 h-5 mr-2" />
              Kirim Balasan
            </Button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  )
}
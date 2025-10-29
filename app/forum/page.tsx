"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, ThumbsUp, Search, Plus, Tag, MessageCircle, X, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

const categories = ["Semua", "Tips", "Tanya Jawab", "Event", "Inovasi", "Diskusi"]

interface Thread {
  id: string | number
  title: string
  category: string
  author: string | number
  author_name: string
  author_city: string
  replies: number
  views: number
  likes: number
  tags: string[]
  isPinned: boolean
  created_at: string
  content?: string
}

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [sortBy, setSortBy] = useState("latest")
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newThread, setNewThread] = useState({ title: "", category: "Tips", content: "" })
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/forum/threads")
        if (!response.ok) throw new Error("Failed to fetch threads")
        const data = await response.json()
        if (data.error) throw new Error(data.error)
        const normalizedThreads = data.map((thread: any) => ({
          id: thread.id,
          title: thread.title,
          category: thread.category,
          author: thread.author_id,
          author_name: thread.author_name,
          author_city: thread.author_city ?? "Kota tidak diketahui",
          replies: thread.replies_count || 0,
          views: thread.views || 0,
          likes: thread.likes || 0,
          tags: [],
          isPinned: thread.is_pinned || false,
          created_at: thread.created_at,
          content: thread.content,
        }))
        setThreads(normalizedThreads)
      } catch (err) {
        console.error("Error fetching threads:", err)
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }
    fetchThreads()
  }, [])

  const handleDeleteThread = async (threadId: string | number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm("Apakah Anda yakin ingin menghapus forum ini?")) {
      return
    }

    try {
      const response = await fetch(`/api/forum/threads/${threadId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete thread")
      
      setThreads(threads.filter(thread => thread.id !== threadId))
    } catch (err) {
      console.error("Error deleting thread:", err)
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  const filteredThreads = threads.filter((thread) => {
    const matchesSearch =
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (thread.tags && thread.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    const matchesCategory = selectedCategory === "Semua" || thread.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedThreads = [...filteredThreads].sort((a, b) => {
    if (sortBy === "latest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    if (sortBy === "popular") return (b.likes || 0) - (a.likes || 0)
    if (sortBy === "most-viewed") return (b.views || 0) - (a.views || 0)
    return 0
  })

  const handleSubmitThread = async (e: React.FormEvent) => {
    e.preventDefault()
    if (authLoading || !user) {
      setError("Please log in to create a forum")
      return
    }

    try {
      const response = await fetch("/api/forum/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newThread,
          author_id: user.id,
          is_pinned: false,
          views: 0,
          replies_count: 0,
          likes: 0,
        }),
      })

      if (!response.ok) throw new Error("Failed to create forum")
      const data = await response.json()
      setThreads([data, ...threads])
      setIsModalOpen(false)
      setNewThread({ title: "", category: "Tips", content: "" })
    } catch (err) {
      console.error("Error creating thread:", err)
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  if (loading || authLoading) return <div className="text-center py-10 text-gray-600">Loading...</div>
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Forum Lingkungan</h1>
            <p className="text-foreground/60 text-sm sm:text-base">Diskusi ide pengurangan sampah dan berbagi best practices</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto btn-default"
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat Topik Baru
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6 sm:mb-8 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-foreground/40" />
          <Input
            placeholder="Cari diskusi atau tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 sm:pl-10 w-full md:w-3/4 lg:w-1/2"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 shrink-0 hover:text-white btn-default"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Sort and Results */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <p className="text-sm text-foreground/60">{sortedThreads.length} forum ditemukan</p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 sm:py-2 rounded-lg border border-border bg-background text-foreground text-sm w-full sm:w-auto"
          >
            <option value="latest">Terbaru</option>
            <option value="popular">Paling Populer</option>
            <option value="most-viewed">Paling Dilihat</option>
          </select>
        </div>

        {/* Forum List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sortedThreads.map((thread) => (
            <Link href={`/forum/${thread.id}`} key={thread.id}>
              <Card className="p-3 sm:p-4 hover:shadow-lg transition-shadow cursor-pointer border border-border hover:border-primary/50 h-full flex flex-col group relative">
                {/* Delete Button - Only show if user owns the thread */}
                {user && thread.author === user.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 opacity-100 transition-opacity bg-background/80 hover:bg-destructive hover:text-destructive-foreground cursor-pointer z-10"
                    onClick={(e) => handleDeleteThread(thread.id, e)}
                    title="Hapus forum"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                )}
                
                <div className="flex-1">
                  <div className="flex items-start gap-1.5 sm:gap-2 mb-2">
                    {thread.isPinned && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded shrink-0">Pinned</span>
                    )}
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded shrink-0">{thread.category}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition">
                    {thread.title}
                  </h3>
                  <p className="text-foreground/60 text-xs sm:text-sm line-clamp-3 mb-3 sm:mb-4">{thread.content}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                    {thread.tags && thread.tags.map((tag) => (
                      <span key={tag} className="text-xs text-foreground/60 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Author Info */}
                  <p className="text-xs sm:text-sm text-foreground/60 mb-2 mt-3 sm:mt-4">
                    dibuat oleh <span className="font-semibold">{thread.author_name}</span> dari{" "}
                    <span className="font-semibold">{thread.author_city}</span>
                  </p>
                </div>

                {/* Stats */}
                <div className="flex gap-3 sm:gap-4 text-foreground/60 text-xs sm:text-sm mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-border/50">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="inline">{thread.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="inline">{thread.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="inline">{thread.replies}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {sortedThreads.length === 0 && (
          <Card className="p-6 sm:p-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-foreground/30" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Belum ada konten</h3>
            <p className="text-foreground/60 mb-4 text-sm sm:text-base">
              {searchQuery || selectedCategory !== "Semua" 
                ? "Tidak ada forum yang sesuai dengan pencarian Anda" 
                : "Jadilah yang pertama memulai diskusi"
              }
            </p>
            <Button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-primary hover:bg-primary/90 btn-default"
            >
              <Plus className="w-4 h-4 mr-2" />
              Buat Topik Pertama
            </Button>
          </Card>
        )}

        {/* Modal for Creating Topic */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-background dark:shadow-xs dark:shadow-amber-100 p-4 sm:p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Buat Topik Baru</h2>

                <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)} className="btn-default">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
              <form onSubmit={handleSubmitThread}>
                <div className="space-y-3 sm:space-y-4">
                  <Input
                    placeholder="Judul Topik"
                    value={newThread.title}
                    onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                    required
                    className="border border-border rounded-lg bg-background text-sm sm:text-base p-2 sm:p-3"
                  />
                  <select
                    value={newThread.category}
                    onChange={(e) => setNewThread({ ...newThread, category: e.target.value })}
                    className="w-full p-2 sm:p-3 border border-border rounded-lg bg-background text-foreground text-sm sm:text-base"
                    required
                  >
                    {categories.filter(cat => cat !== "Semua").map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Isi Pembahasan..."
                    value={newThread.content}
                    onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                    required
                    className="w-full p-2 sm:p-3 border border-border rounded-lg bg-background text-foreground text-sm sm:text-base h-24 sm:h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base py-2 sm:py-3 btn-default"
                  >
                    Buat Topik Baru
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
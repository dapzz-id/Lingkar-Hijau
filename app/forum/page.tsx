"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, ThumbsUp, Search, Plus, Tag, MessageCircle, X } from "lucide-react"
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
      setError("Please log in to create a thread")
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

      if (!response.ok) throw new Error("Failed to create thread")
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Forum Lingkungan</h1>
            <p className="text-foreground/60">Diskusi ide pengurangan sampah dan berbagi best practices</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Buat Thread
          </Button>
        </div>

        {/* Search */}
        <div className="mb-8 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
          <Input
            placeholder="Cari diskusi atau tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full md:w-1/2"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Sort */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-foreground/60">{sortedThreads.length} thread ditemukan</p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 rounded-lg border border-border bg-background text-foreground text-sm"
          >
            <option value="latest">Terbaru</option>
            <option value="popular">Paling Populer</option>
            <option value="most-viewed">Paling Dilihat</option>
          </select>
        </div>

        {/* Threads List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedThreads.map((thread) => (
            <Link href={`/forum/${thread.id}`} key={thread.id}>
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border border-border hover:border-primary/50 h-full flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-2">
                    {thread.isPinned && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Pinned</span>
                    )}
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">{thread.category}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition">
                    {thread.title}
                  </h3>
                  <p className="text-foreground/60 text-sm line-clamp-3 mb-4">{thread.content}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {thread.tags && thread.tags.map((tag) => (
                      <span key={tag} className="text-xs text-foreground/60 flex items-center gap-1 mt-2">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-foreground/60 mb-2">
                    dibuat oleh <span className="font-semibold">{thread.author_name}</span> dari{" "}
                    <span className="font-semibold">{thread.author_city}</span>
                  </p>
                </div>
                <div className="flex gap-4 text-foreground/60 text-sm mt-auto">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {thread.views}
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {thread.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {thread.replies}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Modal for Creating Thread */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-foreground">Buat Thread Baru</h2>
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <form onSubmit={handleSubmitThread}>
                <div className="space-y-4">
                  <Input
                    placeholder="Judul Thread"
                    value={newThread.title}
                    onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                    required
                  />
                  <select
                    value={newThread.category}
                    onChange={(e) => setNewThread({ ...newThread, category: e.target.value })}
                    className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                    required
                  >
                    {categories.filter(cat => cat !== "Semua").map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <Input
                    placeholder="Konten Thread"
                    value={newThread.content}
                    onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                    required
                    className="h-24 resize-none"
                  />
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Buat Thread
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
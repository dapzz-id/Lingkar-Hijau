"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, ThumbsUp, Search, Plus, Tag } from "lucide-react"

const threads = [
  {
    id: 1,
    title: "Tips Efektif Mengurangi Sampah Plastik di Rumah",
    category: "Tips",
    author: "Budi Santoso",
    city: "Jakarta",
    replies: 24,
    views: 1250,
    likes: 89,
    tags: ["plastik", "rumah", "tips"],
    isPinned: true,
  },
  {
    id: 2,
    title: "Bagaimana cara memulai bank sampah di komunitas saya?",
    category: "Tanya Jawab",
    author: "Siti Nurhaliza",
    city: "Bandung",
    replies: 18,
    views: 856,
    likes: 45,
    tags: ["bank-sampah", "komunitas"],
    isPinned: false,
  },
  {
    id: 3,
    title: "Event Clean-up Bersama di Taman Kota - Minggu Depan",
    category: "Event",
    author: "Tim Hijau",
    city: "Surabaya",
    replies: 32,
    views: 2100,
    likes: 156,
    tags: ["event", "clean-up"],
    isPinned: true,
  },
  {
    id: 4,
    title: "Inovasi: Membuat Tas dari Limbah Plastik",
    category: "Inovasi",
    author: "Eka Putri",
    city: "Yogyakarta",
    replies: 15,
    views: 945,
    likes: 67,
    tags: ["inovasi", "plastik", "daur-ulang"],
    isPinned: false,
  },
  {
    id: 5,
    title: "Diskusi: Peran Pemerintah dalam Pengelolaan Sampah",
    category: "Diskusi",
    author: "Ahmad Wijaya",
    city: "Medan",
    replies: 28,
    views: 1680,
    likes: 92,
    tags: ["kebijakan", "pemerintah"],
    isPinned: false,
  },
]

const categories = ["Semua", "Tips", "Tanya Jawab", "Event", "Inovasi", "Diskusi"]

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [sortBy, setSortBy] = useState("latest")

  const filteredThreads = threads.filter((thread) => {
    const matchesSearch =
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.tags.some((tag) => tag.includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "Semua" || thread.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
            className="pl-10"
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
          <p className="text-sm text-foreground/60">{filteredThreads.length} thread ditemukan</p>
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
        <div className="space-y-4">
          {filteredThreads.map((thread) => (
            <Card
              key={thread.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer hover:border-primary/50"
            >
              <div className="flex gap-4">
                {/* Left - Content */}
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-2">
                    {thread.isPinned && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Pinned</span>
                    )}
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">{thread.category}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2 hover:text-primary transition">
                    {thread.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {thread.tags.map((tag) => (
                      <span key={tag} className="text-xs text-foreground/60 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-foreground/60">
                    oleh <span className="font-semibold">{thread.author}</span> dari{" "}
                    <span className="font-semibold">{thread.city}</span>
                  </p>
                </div>

                {/* Right - Stats */}
                <div className="flex gap-6 text-center">
                  <div>
                    <div className="text-lg font-bold text-primary">{thread.replies}</div>
                    <div className="text-xs text-foreground/60">Balasan</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-accent">{thread.views}</div>
                    <div className="text-xs text-foreground/60 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Dilihat
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-secondary">{thread.likes}</div>
                    <div className="text-xs text-foreground/60 flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      Suka
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

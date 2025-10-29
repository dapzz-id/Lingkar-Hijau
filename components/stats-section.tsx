import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"

export default function StatsSection() {
  const [userCount, setUserCount] = useState<number | null>(null)
  const [forumCount, setForumCount] = useState<number | null>(null)

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    })

    const fetchUserCount = async () => {
      try {
        const res = await fetch("/api/auth/count/users")
        if (!res.ok) throw new Error("Failed to fetch user count")
        const data = await res.json()
        setUserCount(data.total || 0)
      } catch (err) {
        console.error(err)
        setUserCount(0)
      }
    }

    const fetchForumCount = async () => {
      try {
        const res = await fetch("/api/auth/count/forum")
        if (!res.ok) throw new Error("Failed to fetch forum count")
        const data = await res.json()
        setForumCount(data.total || 0)
      } catch (err) {
        console.error(err)
        setForumCount(0)
      }
    }

    fetchUserCount()
    fetchForumCount()
  }, [])

  const stats = [
    { label: "Pengguna Terdaftar", value: userCount !== null ? `${userCount.toLocaleString()}` : "0", icon: "👥" },
    { label: "Bank Sampah", value: "4.300+", icon: "🏪" },
    { label: "Sampah Terkelola", value: "5.7 M ton", icon: "♻️" },
    { label: "Jumlah Forum", value: forumCount !== null ? `${forumCount.toLocaleString()}` : "0", icon: "🗣️" }
  ]

  return (
    <section id="impact" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Dampak Nyata untuk Indonesia
          </h2>
          <p 
            className="text-lg text-foreground/60"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Bersama komunitas, kita membangun masa depan yang lebih berkelanjutan
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <Card 
              key={idx} 
              className="p-8 text-center border-border/50 hover:border-primary/30 transition-colors"
              data-aos="flip-up"
              data-aos-delay={300 + (idx * 100)}
              data-aos-duration="600"
            >
              <div className="text-4xl mb-4">{stat.icon}</div>
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-foreground/60">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
import { Card } from "@/components/ui/card"
import { MapPin, Zap, ShoppingCart, Users, TrendingUp, Recycle } from "lucide-react"
import { useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"

const features = [
  {
    icon: Zap,
    title: "AI Scan Sampah",
    description: "Upload foto sampah dan AI kami akan membantu klasifikasi: plastik, organik, logam",
    color: "from-accent to-accent/50",
  },
  {
    icon: ShoppingCart,
    title: "Marketplace Daur Ulang",
    description: "Jual-beli barang hasil daur ulang antar komunitas dengan harga adil",
    color: "from-secondary to-secondary/50",
  },
  {
    icon: Users,
    title: "Forum Komunitas",
    description: "Diskusi ide pengurangan sampah dan berbagi best practices dengan komunitas",
    color: "from-primary to-accent",
  },
  {
    icon: Recycle,
    title: "Edukasi Daur Ulang",
    description: "Pelajari cara daur ulang yang benar dan dampak positifnya untuk lingkungan",
    color: "from-secondary to-primary",
  },
]

export default function FeaturesSection() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    })
  }, [])

  return (
    <section id="features" className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Fitur Unggulan
          </h2>
          <p 
            className="text-lg text-foreground/60 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Platform lengkap untuk mengelola sampah, dan berkontribusi pada ekonomi sirkular
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card
                key={idx}
                className="p-6 hover:shadow-lg transition-shadow border-border/50 hover:border-primary/30"
                data-aos="fade-up"
                data-aos-delay={300 + (idx * 100)}
                data-aos-anchor-placement="top-bottom"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
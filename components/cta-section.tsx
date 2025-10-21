import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CTASection() {
  const router = useRouter()

  return (
    <section id="contact" className="py-20 md:py-32 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Bergabunglah dengan Lingkar Hijau
        </h2>
        <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
          Jadilah bagian dari solusi. Mulai dari melaporkan sampah, belajar daur ulang, hingga menghasilkan pendapatan
          dari ekonomi sirkular.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 btn-style1" onClick={() => router.push("/register")}>
            Daftar Gratis Sekarang
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button size="lg" variant="outline" className="btn-style1" onClick={() => router.push("https://wa.me/6285183262007")}>
            Hubungi Tim Kami
          </Button>
        </div>
      </div>
    </section>
  )
}

import { Button } from "@/components/ui/button"
import ModelViewer from "./model-viewer"
import { ArrowRight, Leaf, Sprout } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"

export default function HeroSection() {
  const router = useRouter()

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    })
  }, [])

  return (
    <section className="relative overflow-hidden py-10 md:py-18">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 -z-10" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div className="order-1 md:order-1 space-y-6 md:space-y-8">
            {/* Badges */}
            <div className="flex flex-col sm:flex-row gap-2 lg:gap-4">
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 w-fit"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <Leaf className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="md:text-sm text-xs font-medium text-primary whitespace-nowrap">
                  Indonesia Emas 2045
                </span>
              </div>

              <div 
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 w-fit"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <Sprout className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="md:text-sm text-xs font-medium text-primary whitespace-nowrap">
                  <span>Sustainable Development Goals </span>
                  <span className="hidden lg:inline">(SDGs)</span>
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              Ubah Sampah Menjadi{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Nilai Ekonomi
              </span>
            </h1>

            {/* Model Viewer 3D - Mobile */}
            <div className="block md:hidden mt-6">
              <div className="relative h-64 sm:h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
                <div className="relative rounded-3xl border border-primary/20 p-4 h-full flex items-center justify-center">
                  <ModelViewer />
                </div>
              </div>
            </div>

            {/* Description */}
            <p 
              className="text-base sm:text-lg text-foreground/70 leading-relaxed text-justify"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Bergabunglah dengan Lingkar Hijau, platform inovatif yang memanfaatkan teknologi untuk
              mengelola sampah kota secara efektif dan menumbuhkan ekonomi sirkular melalui partisipasi
              masyarakat. Bersama-sama, kita ciptakan lingkungan yang lebih bersih dan berkelanjutan untuk
              masa depan Indonesia.
            </p>

            {/* Buttons */}
            <div 
              className="flex flex-col sm:flex-row gap-4 pt-4"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <Button
                size="lg"
                onClick={() => router.push("/login")}
                className="btn-style1 bg-primary hover:bg-primary/90"
                aria-label="Mulai Sekarang"
              >
                Mulai Sekarang
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Button size="lg" variant="outline" className="btn-style1">
                Pelajari Lebih Lanjut
              </Button>
            </div>

            {/* Stats */}
            <div 
              className="flex justify-between sm:justify-start sm:gap-8 pt-6 text-sm"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <div className="text-center sm:text-left">
                <div className="font-bold text-primary text-xl">50K+</div>
                <div className="text-foreground/60 text-xs sm:text-sm">Pengguna Aktif</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="font-bold text-accent text-xl">500+</div>
                <div className="text-foreground/60 text-xs sm:text-sm">Bank Sampah</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="font-bold text-secondary text-xl">2.5M</div>
                <div className="text-foreground/60 text-xs sm:text-sm">Kg Sampah Terkelola</div>
              </div>
            </div>
          </div>

          {/* Model Viewer 3D - Desktop */}
          <div className="hidden md:block order-2 relative h-72 sm:h-96 mt-8 md:mt-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
            <div className="relative rounded-3xl border border-primary/20 p-6 h-full flex items-center justify-center">
              <ModelViewer />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
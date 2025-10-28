import { Leaf } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Lingkar Hijau</span>
            </div>
            <p className="text-foreground/60 text-sm">Platform manajemen sampah terpadu untuk Indonesia Emas 2045</p>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground/60 text-sm">© {new Date().getFullYear()} Semua hak dilindungi.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="https://instagram.com/x.dapzz" className="text-foreground/60 hover:text-foreground text-sm">
              Instagram
            </Link>
            <Link href="https://linkedin.com/in/ditzzyaa" className="text-foreground/60 hover:text-foreground text-sm">
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

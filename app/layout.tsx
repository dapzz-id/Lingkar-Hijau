import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import CartFab from "@/components/cart/cart-fab"
import { classifyPlasticFromImage } from "@/lib/ai-classifier"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lingkar Hijau | DevSpark",
  description: "Platform digital untuk edukasi daur ulang, dan pertumbuhan ekonomi sirkular untuk meraih Indonesia Emas 2045 dan mencapai target SDGs.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <CartProvider>
            {children}
            <CartFab />
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}

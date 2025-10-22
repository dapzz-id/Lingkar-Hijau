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
  title: "SmaRTWaste - Platform Manajemen Sampah Indonesia",
  description: "Platform digital untuk crowdsourcing data sampah, edukasi daur ulang, dan ekonomi sirkular Indonesia",
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

import { Card } from "@/components/ui/card"
import { Leaf, Star } from "lucide-react"

interface ProductInfoProps {
  name: string
  seller: string
  price: number
  originalPrice: number
  rating: number
  reviews: number
  ecoScore: number
  sold: number
}

export default function ProductInfo({
  name,
  seller,
  price,
  originalPrice,
  rating,
  reviews,
  ecoScore,
  sold,
}: ProductInfoProps) {
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{name}</h1>
        <p className="text-primary hover:underline cursor-pointer">{seller}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-500 text-yellow-500" : "text-foreground/20"}`}
            />
          ))}
          <span className="ml-2 font-semibold">{rating}</span>
        </div>
        <span className="text-foreground/60">({reviews} ulasan)</span>
        <span className="text-foreground/60">|</span>
        <span className="text-foreground/60">{sold} terjual</span>
      </div>

      <Card className="p-4 bg-muted/50">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-3xl font-bold text-primary">Rp {price.toLocaleString('id-ID')}</span>
          <span className="text-lg text-foreground/50 line-through">Rp {originalPrice.toLocaleString('id-ID')}</span>
          <span className="px-2 py-1 bg-red-500/20 text-red-600 rounded text-sm font-semibold">-{discount}%</span>
        </div>
        <p className="text-sm text-green-600 font-semibold">Hemat Rp {(originalPrice - price).toLocaleString('id-ID')}</p>
      </Card>

      <Card className="p-4 border-green-500/30 bg-green-500/5">
        <div className="flex items-center gap-2 mb-3">
          <Leaf className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-foreground">Eco Score: {ecoScore}/100</span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${ecoScore}%` }} />
        </div>
      </Card>
    </div>
  )
}

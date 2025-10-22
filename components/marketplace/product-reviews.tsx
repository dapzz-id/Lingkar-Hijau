import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ThumbsUp } from "lucide-react"

interface Review {
  id: number
  author: string
  rating: number
  date: string
  title: string
  content: string
  helpful: number
  images: string[]
}

interface ProductReviewsProps {
  reviews: Review[]
  rating: number
}

export default function ProductReviews({ reviews, rating }: ProductReviewsProps) {
  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card className="p-6 bg-muted/50">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-4xl font-bold text-foreground">{rating}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(rating) ? "fill-yellow-500 text-yellow-500" : "text-foreground/20"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-foreground/60">Berdasarkan {reviews.length} ulasan</p>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm text-foreground/60 w-12">{stars} bintang</span>
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: `${(stars / 5) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Individual Reviews */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Ulasan Pembeli</h3>
        {reviews.map((review) => (
          <Card key={review.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-foreground">{review.author}</p>
                <p className="text-xs text-foreground/60">{review.date}</p>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-foreground/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            <h4 className="font-semibold text-foreground mb-2">{review.title}</h4>
            <p className="text-foreground/70 text-sm mb-4">{review.content}</p>

            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ThumbsUp className="w-4 h-4" />
              Membantu ({review.helpful})
            </Button>
          </Card>
        ))}
      </div>

      {/* Write Review Button */}
      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6">Tulis Ulasan Anda</Button>
    </div>
  )
}

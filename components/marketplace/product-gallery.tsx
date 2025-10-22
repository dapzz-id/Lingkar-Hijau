"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card className="overflow-hidden bg-muted/50 relative group">
        <div className={`h-96 md:h-[500px] ${images[selectedImage]} flex items-center justify-center relative`}>
          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background rounded-lg transition opacity-0 group-hover:opacity-100 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background rounded-lg transition opacity-0 group-hover:opacity-100 z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-background/80 rounded-lg text-sm font-medium">
            {selectedImage + 1}/{images.length}
          </div>
        </div>
      </Card>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`h-20 rounded-lg overflow-hidden border-2 transition ${
              selectedImage === idx ? "border-primary" : "border-border hover:border-primary/50"
            }`}
          >
            <div className={`w-full h-full ${image}`} />
          </button>
        ))}
      </div>
    </div>
  )
}

"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

export type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clear: () => void
  count: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = "lh_cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e)
    }
  }, [])

  // Persist to localStorage whenever items change
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      }
    } catch (e) {
      console.error("Failed to save cart to storage", e)
    }
  }, [items])

  const addItem: CartContextType["addItem"] = (item, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity }
        return next
      }
      return [...prev, { ...item, quantity }]
    })
  }

  const removeItem: CartContextType["removeItem"] = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const updateQuantity: CartContextType["updateQuantity"] = (id, quantity) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0),
    )
  }

  const clear = () => setItems([])

  const count = useMemo(() => items.reduce((acc, i) => acc + i.quantity, 0), [items])
  const total = useMemo(() => items.reduce((acc, i) => acc + i.price * i.quantity, 0), [items])

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clear, count, total }),
    [items, count, total],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}


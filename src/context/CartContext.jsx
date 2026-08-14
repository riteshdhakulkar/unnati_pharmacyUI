import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'oza_cart'

const makeKey = (id, optionLabel) => `${id}::${optionLabel || ''}`

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  /**
   * Add a product line to the cart. If the same product + option already
   * exists, quantities are merged.
   */
  const addItem = ({ id, name, image, price, optionLabel = '', quantity = 1 }) => {
    const key = makeKey(id, optionLabel)
    setItems((prev) => {
      const existing = prev.find((it) => it.key === key)
      if (existing) {
        return prev.map((it) =>
          it.key === key ? { ...it, quantity: it.quantity + quantity } : it,
        )
      }
      return [...prev, { key, id, name, image, price: Number(price) || 0, optionLabel, quantity }]
    })
  }

  const updateQuantity = (key, delta) =>
    setItems((prev) =>
      prev.map((it) =>
        it.key === key ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it,
      ),
    )

  const setQuantity = (key, quantity) =>
    setItems((prev) =>
      prev.map((it) => (it.key === key ? { ...it, quantity: Math.max(1, quantity) } : it)),
    )

  const removeItem = (key) => setItems((prev) => prev.filter((it) => it.key !== key))

  const clear = () => setItems([])

  const { count, subtotal } = useMemo(() => {
    return items.reduce(
      (acc, it) => {
        acc.count += it.quantity
        acc.subtotal += it.price * it.quantity
        return acc
      },
      { count: 0, subtotal: 0 },
    )
  }, [items])

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, setQuantity, removeItem, clear, count, subtotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

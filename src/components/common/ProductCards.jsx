import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../../api/products'
import { useCart } from '../../context/CartContext'

/**
 * Fetches products for a given category/salt/manufacturer/search and renders them as `.medicine-card`s.
 * Drop this inside an existing `.medicine-container` to keep the page layout.
 */
export default function ProductCards({ category, salt, manufacturer, search }) {
  const navigate = useNavigate()
  const { addItem, items } = useCart()
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    let active = true
    setStatus('loading')

    getProducts({ category, salt, manufacturer, search })
      .then((data) => {
        if (!active) return
        setProducts(data)
        setStatus('ready')
      })
      .catch(() => active && setStatus('error'))

    return () => {
      active = false
    }
  }, [category, salt, manufacturer, search])

  if (status === 'loading') {
    return <p className="products-status">Loading products…</p>
  }

  if (status === 'error') {
    return <p className="products-status">Unable to load products right now.</p>
  }

  if (products.length === 0) {
    return <p className="products-status">No products available matching your selection.</p>
  }

  return (
    <>
      {products.map((p) => {
        const inCart = items.some((item) => item.id === p.id)

        const handleAddToCart = (event) => {
          event.stopPropagation()
          addItem({
            id: p.id,
            name: p.name,
            image: p.image || '/placeholder.png',
            price: p.price.min ?? 0,
          })
        }

        return (
          <div className="medicine-card" key={p.id}>
            <img src={p.image || '/placeholder.png'} alt={p.name} />
            <h3>{p.name}</h3>
            {p.price.label && <p className="medicine-price">{p.price.label}</p>}
            <div className="product-overlay">
              <button
                type="button"
                className={`cart-btn ${inCart ? 'cart-btn-added' : ''}`}
                onClick={handleAddToCart}
              >
                {inCart ? 'Added' : 'Add to Cart'}
              </button>
              <button className="select-btn" onClick={() => navigate(`/product/${p.id}`)}>
                Select Options
              </button>
            </div>
          </div>
        )
      })}
    </>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, updateQuantity, removeItem, count } = useCart()
  const [showNotice, setShowNotice] = useState(true)

  return (
    <>
      {/* ── Outer page background ── */}
      <div style={{ backgroundColor: '#fffdf7', padding: '50px 0' }}>

        {/* ── Centered container ── */}
        <div
          style={{
            maxWidth: '1300px',
            margin: '0 auto',
            padding: '0 32px',
            boxSizing: 'border-box',
          }}
        >
          {/* ══════════════════════════════════════════
              SUCCESS NOTIFICATION BAR
          ══════════════════════════════════════════ */}
          {showNotice && items.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f0fff4',
                border: '1px solid #e6e0d4',
                height: '70px',
                padding: '0 24px',
                marginBottom: '32px',
                boxSizing: 'border-box',
                gap: '16px',
              }}
              className="cart-notice"
            >
              {/* Left: icon + text */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Green check circle */}
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#22c55e',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    flexShrink: 0,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </div>
                <span
                  style={{
                    fontSize: '15px',
                    color: '#2d4a2d',
                    fontWeight: 400,
                  }}
                >
                  You have {count} item{count === 1 ? '' : 's'} in your cart.
                </span>
              </div>

              {/* Right: Continue shopping + close */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                <button
                  id="cart-continue-shopping"
                  onClick={() => navigate('/shop')}
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#166534',
                    border: '1px solid #16a34a',
                    background: 'transparent',
                    padding: '8px 18px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#dcfce7')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  Continue shopping
                </button>
                <button
                  id="cart-close-notice"
                  onClick={() => setShowNotice(false)}
                  aria-label="Close notification"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '20px',
                    color: '#7d7361',
                    lineHeight: 1,
                    padding: '0 4px',
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════
              CART TABLE SECTION
          ══════════════════════════════════════════ */}
          {items.length === 0 ? (
            <div
              style={{
                backgroundColor: '#fff',
                border: '1px solid #e6e0d4',
                padding: '48px 32px',
                textAlign: 'center',
                color: '#7d7361',
                fontSize: '18px',
              }}
            >
              Your cart is empty.
            </div>
          ) : (
            <>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e6e0d4',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                {/* ── Table (desktop) ── */}
                <div className="cart-table-wrapper">
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      tableLayout: 'fixed',
                    }}
                  >
                    {/* Header */}
                    <colgroup>
                      <col style={{ width: '60px' }} />
                      <col />
                      <col style={{ width: '220px' }} />
                    </colgroup>
                    <thead>
                      <tr
                        style={{
                          backgroundColor: '#ffffff',
                          borderBottom: '1px solid #e6e0d4',
                        }}
                      >
                        <th style={thStyle}></th>
                        <th style={{ ...thStyle, textAlign: 'left' }}>Product</th>
                        <th style={{ ...thStyle, textAlign: 'left' }}>Quantity</th>
                      </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                      {items.map((item) => (
                        <tr
                          key={item.key}
                          style={{
                            borderBottom: '1px solid #f3efe7',
                          }}
                        >
                          {/* Remove button */}
                          <td style={{ ...tdStyle, textAlign: 'center' }}>
                            <button
                              id={`remove-item-${item.key}`}
                              onClick={() => removeItem(item.key)}
                              aria-label="Remove item"
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                border: '1px solid #cfc6b5',
                                background: 'transparent',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                color: '#7d7361',
                                transition: 'all 0.15s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#ef4444'
                                e.currentTarget.style.color = '#ef4444'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#cfc6b5'
                                e.currentTarget.style.color = '#7d7361'
                              }}
                            >
                              ×
                            </button>
                          </td>

                          {/* Product */}
                          <td style={tdStyle}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                              }}
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{
                                  width: '95px',
                                  height: '95px',
                                  objectFit: 'contain',
                                  flexShrink: 0,
                                  background: '#fffdf7',
                                }}
                              />
                              <span
                                style={{
                                  fontSize: '16px',
                                  color: '#1a1610',
                                  fontWeight: 500,
                                }}
                              >
                                {item.name}
                              </span>
                            </div>
                          </td>

                          {/* Quantity selector */}
                          <td style={tdStyle}>
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'stretch',
                                border: '1px solid #cfc6b5',
                              }}
                            >
                              <button
                                id={`qty-dec-${item.key}`}
                                onClick={() => updateQuantity(item.key, -1)}
                                style={qtyBtnStyle}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.backgroundColor = '#f3efe7')
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor = '#fff')
                                }
                              >
                                −
                              </button>
                              <span
                                style={{
                                  width: '48px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '16px',
                                  color: '#1a1610',
                                  borderLeft: '1px solid #cfc6b5',
                                  borderRight: '1px solid #cfc6b5',
                                  userSelect: 'none',
                                }}
                              >
                                {item.quantity}
                              </span>
                              <button
                                id={`qty-inc-${item.key}`}
                                onClick={() => updateQuantity(item.key, 1)}
                                style={qtyBtnStyle}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.backgroundColor = '#f3efe7')
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor = '#fff')
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ── Mobile stacked rows ── */}
                <div className="cart-mobile-rows">
                  {items.map((item) => (
                    <div
                      key={item.key}
                      style={{
                        padding: '20px 16px',
                        borderBottom: '1px solid #e6e0d4',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                      }}
                    >
                      {/* Top: image + name + remove */}
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'contain',
                            background: '#fffdf7',
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 500, color: '#1a1610' }}>
                            {item.name}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.key)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            border: '1px solid #cfc6b5',
                            background: 'transparent',
                            cursor: 'pointer',
                            fontSize: '16px',
                            color: '#7d7361',
                            flexShrink: 0,
                          }}
                        >
                          ×
                        </button>
                      </div>

                      {/* Bottom: qty */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'stretch', border: '1px solid #cfc6b5' }}>
                          <button
                            onClick={() => updateQuantity(item.key, -1)}
                            style={qtyBtnStyle}
                          >
                            −
                          </button>
                          <span
                            style={{
                              width: '44px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '15px',
                              borderLeft: '1px solid #cfc6b5',
                              borderRight: '1px solid #cfc6b5',
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.key, 1)}
                            style={qtyBtnStyle}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Update cart button ── */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    padding: '20px 32px',
                    borderTop: '1px solid #e6e0d4',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <button
                    id="update-cart-btn"
                    style={{
                      width: '210px',
                      height: '65px',
                      backgroundColor: 'transparent',
                      color: '#1a1610',
                      fontSize: '16px',
                      fontWeight: 700,
                      border: '1.5px solid #cfc6b5',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      letterSpacing: '0.5px',
                      transition: 'background-color 0.15s, border-color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fff9ec'
                      e.currentTarget.style.borderColor = '#f0ac1b'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.borderColor = '#cfc6b5'
                    }}
                  >
                    UPDATE CART
                  </button>
                </div>
              </div>

              {/* Checkout button */}
              <div style={{ marginTop: '32px' }}>
                <button
                  id="proceed-to-checkout-btn"
                  onClick={() => navigate('/checkout')}
                  style={{
                    width: '300px',
                    height: '72px',
                    backgroundColor: '#f0ac1b',
                    color: '#1a1610',
                    fontSize: '22px',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    letterSpacing: '0.3px',
                    transition: 'background-color 0.15s, box-shadow 0.15s',
                  }}
                  className="checkout-btn-responsive"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5ba38'
                    e.currentTarget.style.boxShadow =
                      '0 8px 24px rgba(240, 172, 27, 0.32)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0ac1b'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  Proceed to checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Responsive overrides ── */}
      <style>{`
        /* Desktop: show table, hide mobile cards */
        .cart-table-wrapper { display: block; overflow-x: auto; }
        .cart-mobile-rows   { display: none; }

        /* Tablet ≤ 900px */
        @media (max-width: 900px) {
          .cart-totals-heading { font-size: 38px !important; }
        }

        /* Mobile ≤ 640px */
        @media (max-width: 640px) {
          .cart-table-wrapper { display: none; }
          .cart-mobile-rows   { display: block; }
          .cart-notice        { height: auto !important; flex-wrap: wrap; padding: 14px 16px !important; }
          .cart-totals-heading { font-size: 32px !important; }
          .checkout-btn-responsive { width: 100% !important; }
        }
      `}</style>
    </>
  )
}

/* ── Shared style objects ── */
const thStyle = {
  fontSize: '18px',
  fontWeight: 600,
  color: '#423c31',
  padding: '20px 16px',
  whiteSpace: 'nowrap',
}

const tdStyle = {
  padding: '20px 16px',
  verticalAlign: 'middle',
}

const qtyBtnStyle = {
  width: '40px',
  height: '44px',
  background: '#ffffff',
  border: 'none',
  cursor: 'pointer',
  fontSize: '18px',
  color: '#423c31',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.1s',
}

import React, { useState, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import EnquiryPopup from './components/common/EnquiryPopup'

import Home from './components/HomePage/Home'
import Shop from './components/ShopAllPage/Shop'
import AboutUs from './components/AboutUsPage/AboutUs'
import LatestNews from './components/LatestNewsPage/LatestNews'
import Contact from './components/ContactPage/ContactSection'
import SingleProduct from './components/SingleProduct/SingleProduct'
import Cart from './components/CartPage/CartPage'
import Checkout from './components/CheckoutPage/CheckoutP'
import PrivacyPolicy from './components/PrivacyPolicyPage/PrivacyPolicy'
import ReturnRefundPolicy from './components/ReturnRefundPolicyPage/ReturnRefundPolicy'

const POPUP_DELAY_MS = 3000 // 3 seconds after every page visit

const App = () => {
  const location = useLocation()
  const [showEnquiry, setShowEnquiry] = useState(false)

  // Re-trigger popup 3s after every route change
  useEffect(() => {
    setShowEnquiry(false)
    const timer = setTimeout(() => setShowEnquiry(true), POPUP_DELAY_MS)
    return () => clearTimeout(timer)
  }, [location.pathname])

  // Allow any component to open the popup via: window.dispatchEvent(new Event('open-enquiry'))
  useEffect(() => {
    const handler = () => setShowEnquiry(true)
    window.addEventListener('open-enquiry', handler)
    return () => window.removeEventListener('open-enquiry', handler)
  }, [])

  return (
    <>
      {/* ── Global Enquiry Popup (all pages) ── */}
      <EnquiryPopup open={showEnquiry} onClose={() => setShowEnquiry(false)} />

      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/latest-news" element={<LatestNews />} />
        <Route path="/contact" element={<Contact />} />
        {/* A bare /product has no medicine to show — send it to the catalogue. */}
        <Route path="/product" element={<Navigate to="/shop" replace />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/return-refund" element={<ReturnRefundPolicy />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App

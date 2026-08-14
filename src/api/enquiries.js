// Enquiry + order submission.
import { post } from './http'

/**
 * Submits the Medicine Enquiry Form. The backend stores the enquiry, notifies the
 * admin inbox and emails an acknowledgement back to the customer. Used by the
 * contact page, the global enquiry popup and the product page's enquiry form.
 *
 * @param {object} enquiry
 * @param {string} enquiry.name        required
 * @param {string} [enquiry.email]     one of email / phone is required
 * @param {string} [enquiry.phone]
 * @param {string} [enquiry.country]
 * @param {string} [enquiry.medicine]  product the enquiry is about
 * @param {string} [enquiry.category]
 * @param {string} [enquiry.quantity]
 * @param {string} [enquiry.message]
 * @param {string} [enquiry.source]    which form it came from
 * @returns {Promise<{id: number, status: string, createdDate: string}>} the stored enquiry
 */
export function sendEnquiry(enquiry) {
  return post('/public/medicine-enquiry', {
    name: enquiry.name,
    email: enquiry.email || null,
    phone: enquiry.phone || null,
    country: enquiry.country || null,
    medicine: enquiry.medicine || null,
    category: enquiry.category || null,
    quantity: enquiry.quantity != null ? String(enquiry.quantity) : null,
    message: enquiry.message || null,
    source: enquiry.source || null,
  })
}

/**
 * Submits the Contact page form. The backend stores the message and notifies the
 * admin inbox. Unlike {@link sendEnquiry}, this carries its own subject line and
 * does not send the sender an acknowledgement.
 *
 * @param {object} contact
 * @param {string} contact.name       required
 * @param {string} [contact.email]    one of email / phone is required
 * @param {string} [contact.phone]
 * @param {string} [contact.country]
 * @param {string} [contact.subject]
 * @param {string} [contact.message]  required unless a subject is given
 * @returns {Promise<{id: number, status: string, createdDate: string}>} the stored message
 */
export function sendContactMessage(contact) {
  return post('/public/contact', {
    name: contact.name,
    email: contact.email || null,
    phone: contact.phone || null,
    country: contact.country || null,
    subject: contact.subject || null,
    message: contact.message || null,
  })
}

/**
 * Places an order. The backend saves it and mails both the customer and the admin.
 *
 * @param {object} order
 * @param {object} order.billing   first/last name, email, phone, address, city, state, zip, country
 * @param {object} [order.shipping] same shape; omitted means "same as billing"
 * @param {string} [order.notes]
 * @param {Array}  order.items     cart lines: { id, name, optionLabel, quantity, price }
 * @param {number} order.subtotal
 * @param {number} order.total
 */
export function placeOrder(order) {
  const { billing, shipping, items = [] } = order

  return post('/enquiry', {
    firstName: billing.firstName,
    lastName: billing.lastName,
    email: billing.email,
    phone: billing.phone,
    country: billing.country,
    state: billing.state,
    city: billing.city,
    address: billing.address,
    zipCode: billing.zipCode,
    notes: order.notes || null,
    paymentMethod: order.paymentMethod || 'BANK_TRANSFER',
    subtotal: order.subtotal,
    total: order.total,
    shippingAddress: shipping
      ? {
          firstName: shipping.firstName,
          lastName: shipping.lastName,
          country: shipping.country,
          state: shipping.state,
          city: shipping.city,
          address: shipping.address,
          zipCode: shipping.zipCode,
        }
      : null,
    items: items.map((item) => ({
      productId: Number.isFinite(Number(item.id)) ? Number(item.id) : null,
      name: item.name,
      option: item.optionLabel || null,
      quantity: item.quantity,
      price: item.price,
      lineTotal: Number((item.price * item.quantity).toFixed(2)),
    })),
  })
}

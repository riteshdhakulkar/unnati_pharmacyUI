import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { placeOrder } from "../../api/enquiries";
import { getCountries, FALLBACK_COUNTRIES } from "../../api/countries";

const EMPTY_ADDRESS = {
  firstName: "",
  lastName: "",
  country: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  phone: "",
  email: "",
};

const money = (n) => `$${Number(n || 0).toFixed(2)}`;

export default function ShopCheckout() {
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();

  const [agreed, setAgreed] = useState(false);
  const [shipToDifferent, setShipToDifferent] = useState(false);
  const [billing, setBilling] = useState(EMPTY_ADDRESS);
  const [shipping, setShipping] = useState(EMPTY_ADDRESS);
  const [notes, setNotes] = useState("");
  const [countries, setCountries] = useState(FALLBACK_COUNTRIES);
  const [status, setStatus] = useState("idle"); // idle | placing | placed | error
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    let active = true;
    getCountries()
      .then((list) => {
        // The demo API key returns a single sample country — keep the static
        // list until a real key is configured.
        if (active && list.length > 1) setCountries(list.map((c) => c.name));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const total = subtotal;

  const updateBilling = (field) => (e) =>
    setBilling((b) => ({ ...b, [field]: e.target.value }));
  const updateShipping = (field) => (e) =>
    setShipping((s) => ({ ...s, [field]: e.target.value }));

  const canSubmit = agreed && items.length > 0 && status !== "placing";

  const orderPayload = useMemo(
    () => ({
      billing,
      shipping: shipToDifferent ? shipping : null,
      notes,
      items,
      subtotal: Number(subtotal.toFixed(2)),
      total: Number(total.toFixed(2)),
      paymentMethod: "BANK_TRANSFER",
    }),
    [billing, shipping, shipToDifferent, notes, items, subtotal, total],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("placing");
    setError("");

    try {
      const saved = await placeOrder(orderPayload);
      setOrderId(saved?.id ?? null);
      setStatus("placed");
      // The order now lives on the server and a confirmation email is on its
      // way, so the local cart has done its job.
      clear();
    } catch (err) {
      setError(err.message || "We could not place your order. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="fs-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

        .fs-root {
          font-family: 'Montserrat', sans-serif;
          background: #ffffff;
          color: #1a1610;
          padding: 40px 20px 80px;
          box-sizing: border-box;
          min-height: 100%;
        }
        .fs-root *, .fs-root *::before, .fs-root *::after { box-sizing: border-box; }

        .fs-container {
          max-width: 1140px;
          margin: 0 auto;
        }

        .fs-top-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .fs-section-title {
          font-size: 28px;
          font-weight: 500;
          color: #1a1610;
          margin: 0 0 24px;
        }

        .fs-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .fs-field { margin-bottom: 20px; }
        .fs-field:last-child { margin-bottom: 0; }

        .fs-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
          color: #1a1610;
        }
        .fs-req { color: #d0021b; margin-left: 4px; }

        .fs-input, .fs-select, .fs-textarea {
          width: 100%;
          padding: 12px 14px;
          font-size: 14px;
          font-family: 'Montserrat', sans-serif;
          border: 1px solid #e6e0d4;
          background: #fff;
          color: #1a1610;
          outline: none;
        }

        .fs-input:focus, .fs-select:focus, .fs-textarea:focus {
          border-color: #f0ac1b;
          box-shadow: 0 0 0 3px rgba(240, 172, 27, 0.25);
        }

        .fs-textarea {
          resize: vertical;
          min-height: 90px;
          border-color: #000;
        }

        .fs-input:invalid:not(:focus):not(:placeholder-shown) {
          border-color: #d0021b;
        }

        .fs-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat;
          background-position: right 14px top 50%;
          background-size: 10px auto;
          cursor: pointer;
        }

        /* Your Order Table */
        .fs-order-section {
          margin-top: 40px;
        }

        .fs-order-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
          border: 1px solid #e6e0d4;
        }

        .fs-order-table th, .fs-order-table td {
          padding: 16px;
          text-align: left;
          border-bottom: 1px solid #e6e0d4;
          font-size: 15px;
          color: #1a1610;
        }

        .fs-order-table th {
          font-weight: 600;
          color: #5c5445;
        }

        .fs-order-table .fs-total-label {
          font-weight: 700;
          color: #1a1610;
        }

        .fs-order-table .fs-total-value {
          font-weight: 700;
          color: #1a1610;
        }

        .fs-line-option {
          display: block;
          font-size: 13px;
          color: #7d7361;
          padding-top: 4px;
        }

        /* Payment Section */
        .fs-payment-box {
          background-color: #f3efe7;
          padding: 30px;
          border-radius: 4px;
        }

        .fs-payment-title {
          font-size: 14px;
          font-weight: 500;
          margin: 0 0 20px;
          color: #423c31;
        }

        .fs-payment-desc {
          background: #e6e0d4;
          padding: 20px;
          font-size: 14px;
          color: #423c31;
          position: relative;
          margin-bottom: 30px;
          line-height: 1.5;
        }

        .fs-payment-desc::before {
          content: "";
          position: absolute;
          top: -10px;
          left: 20px;
          border-width: 0 10px 10px 10px;
          border-style: solid;
          border-color: transparent transparent #e6e0d4 transparent;
        }

        .fs-terms-box {
          border-top: 1px solid #e6e0d4;
          padding-top: 24px;
        }

        .fs-terms {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #423c31;
          margin-bottom: 24px;
        }

        .fs-terms input {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .fs-place-btn {
          background: #f0ac1b;
          color: #1a1610;
          border: none;
          border-radius: 10px;
          padding: 16px 32px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          float: right;
          transition: background 0.2s, box-shadow 0.2s;
        }

        .fs-place-btn:hover {
          background: #f5ba38;
          box-shadow: 0 8px 24px rgba(240, 172, 27, 0.28);
        }

        .fs-place-btn:disabled {
          background: #e6e0d4;
          color: #7d7361;
          box-shadow: none;
          cursor: not-allowed;
        }

        .fs-error {
          background: #fdeaea;
          border: 1px solid #f3c2c2;
          color: #b91c1c;
          padding: 14px 16px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .fs-confirmation {
          max-width: 640px;
          margin: 40px auto;
          text-align: center;
          border: 1px solid #e6e0d4;
          border-radius: 14px;
          padding: 48px 32px;
        }
        .fs-confirmation h1 { font-size: 28px; font-weight: 600; margin: 0 0 12px; }
        .fs-confirmation p { color: #5c5445; line-height: 1.6; margin: 0 0 8px; }

        .fs-empty {
          max-width: 640px;
          margin: 40px auto;
          text-align: center;
          color: #5c5445;
        }

        .clearfix::after {
          content: "";
          clear: both;
          display: table;
        }

        /* Responsive */
        @media (max-width: 800px) {
          .fs-top-grid { grid-template-columns: 1fr; gap: 30px; }
          .fs-row { grid-template-columns: 1fr; gap: 0; }
        }
      `}</style>

      {status === "placed" ? (
        <div className="fs-container">
          <div className="fs-confirmation">
            <h1>Thank you for your order</h1>
            {orderId && <p>Your order number is <strong>#{orderId}</strong>.</p>}
            <p>
              We have emailed your confirmation and our bank details. Your order is
              on hold until we confirm that payment has been received.
            </p>
            <button
              type="button"
              className="fs-place-btn"
              style={{ float: "none", marginTop: 24 }}
              onClick={() => navigate("/shop")}
            >
              Continue shopping
            </button>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="fs-container">
          <div className="fs-empty">
            <h1 className="fs-section-title">Your cart is empty</h1>
            <p>Add a medicine to your cart before checking out.</p>
            <button
              type="button"
              className="fs-place-btn"
              style={{ float: "none", marginTop: 24 }}
              onClick={() => navigate("/shop")}
            >
              Browse the catalog
            </button>
          </div>
        </div>
      ) : (
        <form className="fs-container" onSubmit={handleSubmit}>
          <div className="fs-top-grid">
            {/* LEFT COLUMN: Billing Details */}
            <div>
              <h1 className="fs-section-title">Billing details</h1>

              <div className="fs-row">
                <div className="fs-field">
                  <label className="fs-label">First name <span className="fs-req">*</span></label>
                  <input className="fs-input" type="text" required value={billing.firstName} onChange={updateBilling("firstName")} />
                </div>
                <div className="fs-field">
                  <label className="fs-label">Last name <span className="fs-req">*</span></label>
                  <input className="fs-input" type="text" required value={billing.lastName} onChange={updateBilling("lastName")} />
                </div>
              </div>

              <div className="fs-row">
                <div className="fs-field">
                  <label className="fs-label">Country / Region <span className="fs-req">*</span></label>
                  <select className="fs-select" required value={billing.country} onChange={updateBilling("country")}>
                    <option value="" disabled>Select a country</option>
                    {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="fs-field">
                  <label className="fs-label">Street address <span className="fs-req">*</span></label>
                  <input className="fs-input" type="text" required placeholder="House number and street name" value={billing.address} onChange={updateBilling("address")} />
                </div>
              </div>

              <div className="fs-row">
                <div className="fs-field">
                  <label className="fs-label">Town / City <span className="fs-req">*</span></label>
                  <input className="fs-input" type="text" required value={billing.city} onChange={updateBilling("city")} />
                </div>

                <div className="fs-field">
                  <label className="fs-label">State / Province <span className="fs-req">*</span></label>
                  <input className="fs-input" type="text" required value={billing.state} onChange={updateBilling("state")} />
                </div>
              </div>

              <div className="fs-row">
                <div className="fs-field">
                  <label className="fs-label">ZIP Code <span className="fs-req">*</span></label>
                  <input className="fs-input" type="text" required value={billing.zipCode} onChange={updateBilling("zipCode")} />
                </div>

                <div className="fs-field">
                  <label className="fs-label">Phone <span className="fs-req">*</span></label>
                  <input className="fs-input" type="tel" required value={billing.phone} onChange={updateBilling("phone")} />
                </div>

                <div className="fs-field">
                  <label className="fs-label">Email address <span className="fs-req">*</span></label>
                  <input className="fs-input" type="email" required value={billing.email} onChange={updateBilling("email")} />
                </div>
              </div>

              <label className="fs-terms" style={{ marginTop: 24 }}>
                <input
                  type="checkbox"
                  checked={shipToDifferent}
                  onChange={(e) => setShipToDifferent(e.target.checked)}
                />
                Ship to a different address?
              </label>

              {shipToDifferent && (
                <>
                  <h1 className="fs-section-title" style={{ marginTop: 24 }}>Shipping details</h1>

                  <div className="fs-row">
                    <div className="fs-field">
                      <label className="fs-label">First name <span className="fs-req">*</span></label>
                      <input className="fs-input" type="text" required value={shipping.firstName} onChange={updateShipping("firstName")} />
                    </div>
                    <div className="fs-field">
                      <label className="fs-label">Last name <span className="fs-req">*</span></label>
                      <input className="fs-input" type="text" required value={shipping.lastName} onChange={updateShipping("lastName")} />
                    </div>
                  </div>

                  <div className="fs-row">
                    <div className="fs-field">
                      <label className="fs-label">Country / Region <span className="fs-req">*</span></label>
                      <select className="fs-select" required value={shipping.country} onChange={updateShipping("country")}>
                        <option value="" disabled>Select a country</option>
                        {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="fs-field">
                      <label className="fs-label">Street address <span className="fs-req">*</span></label>
                      <input className="fs-input" type="text" required placeholder="House number and street name" value={shipping.address} onChange={updateShipping("address")} />
                    </div>
                  </div>

                  <div className="fs-row">
                    <div className="fs-field">
                      <label className="fs-label">Town / City <span className="fs-req">*</span></label>
                      <input className="fs-input" type="text" required value={shipping.city} onChange={updateShipping("city")} />
                    </div>

                    <div className="fs-field">
                      <label className="fs-label">State / Province <span className="fs-req">*</span></label>
                      <input className="fs-input" type="text" required value={shipping.state} onChange={updateShipping("state")} />
                    </div>
                  </div>

                  <div className="fs-field">
                    <label className="fs-label">ZIP Code <span className="fs-req">*</span></label>
                    <input className="fs-input" type="text" required value={shipping.zipCode} onChange={updateShipping("zipCode")} />
                  </div>
                </>
              )}
            </div>

            {/* RIGHT COLUMN: Additional info */}
            <div>
              <h2 className="fs-section-title">Additional information</h2>
              <div className="fs-field">
                <label className="fs-label">Order notes (optional)</label>
                <textarea
                  className="fs-textarea"
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  style={{ minHeight: '120px' }}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: Order & Payment */}
          <div className="fs-order-section">
            <h2 className="fs-section-title">Your order</h2>

            <table className="fs-order-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.key}>
                    <td>
                      {item.name} <strong>× {item.quantity}</strong>
                      {item.optionLabel && (
                        <span className="fs-line-option">{item.optionLabel}</span>
                      )}
                    </td>
                    <td>{money(item.price * item.quantity)}</td>
                  </tr>
                ))}
                <tr>
                  <td className="fs-total-label">Subtotal</td>
                  <td className="fs-total-value">{money(subtotal)}</td>
                </tr>
                <tr>
                  <td className="fs-total-label">Total</td>
                  <td className="fs-total-value">{money(total)}</td>
                </tr>
              </tbody>
            </table>

            <div className="fs-payment-box">
              <p className="fs-payment-title">PAY WITH INTERNET BANKING.</p>
              <div className="fs-payment-desc">
                Direct deposit. The safe way to make a payment to an Indian bank. Place your order and check your email for details.
              </div>

              {status === "error" && <div className="fs-error" role="alert">{error}</div>}

              <div className="fs-terms-box clearfix">
                <label className="fs-terms">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  I have read and agree to the website terms and conditions <span className="fs-req">*</span>
                </label>

                <button type="submit" className="fs-place-btn" disabled={!canSubmit}>
                  {status === "placing" ? "Placing order…" : "Place order"}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

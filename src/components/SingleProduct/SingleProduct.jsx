import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getProductById } from "../../api/products";
import { sendEnquiry } from "../../api/enquiries";
import { getCountries, FALLBACK_COUNTRIES } from "../../api/countries";
import {
  FiArrowLeft,
  FiSend,
  FiChevronDown,
  FiShield,
  FiFileText,
  FiLock,
  FiAlertTriangle,
  FiHelpCircle,
} from "react-icons/fi";
import "./SingleProduct.css";

const STATUS_CLASS = {
  SAFE: "status-safe",
  "SAFE IF PRESCRIBED": "status-safe",
  CAUTION: "status-caution",
  "SEEK THE ADVICE OF YOUR DOCTOR": "status-caution",
};

/** Anything the admin did not classify as safe is shown as a caution. */
const statusClassFor = (status) => STATUS_CLASS[String(status).toUpperCase()] || "status-caution";

function EnquiryForm({ product }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    country: "",
    quantity: "",
    message: "",
  });
  const [countries, setCountries] = useState(FALLBACK_COUNTRIES.map((name) => ({ name, code: "" })));
  const [state, setState] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");
  const [reference, setReference] = useState(null);

  useEffect(() => {
    let active = true;
    getCountries()
      .then((list) => {
        // The demo API key returns a single sample country — keep the fallback
        // list until a real key is configured.
        if (active && list.length > 1) setCountries(list);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      const saved = await sendEnquiry({
        ...form,
        medicine: product.name,
        category: product.categoryLabel,
        source: "Product page",
      });
      setReference(saved?.id ?? null);
      setState("sent");
    } catch (err) {
      setError(err.message || "We could not send your enquiry. Please try again.");
      setState("error");
    }
  };

  return (
    <aside className="enquiry-card">
      <span className="chip chip-yellow">Enquiry Only</span>
      <h2 className="enquiry-title">Product Enquiry</h2>
      <p className="enquiry-subtitle">
        Submit an enquiry for wholesale sourcing, pricing, and cold-chain delivery.
        Our team responds within 24 hours.
      </p>

      <form className="enquiry-form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">Medicine Name</span>
          <input className="field-input field-input-locked" value={product.name} disabled readOnly />
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field-label">Your Name *</span>
            <input
              className="field-input"
              placeholder="Full name"
              required
              value={form.name}
              onChange={update("name")}
            />
          </label>
          <label className="field">
            <span className="field-label">Phone Number</span>
            <input
              className="field-input"
              placeholder="+1 234 567 890"
              value={form.phone}
              onChange={update("phone")}
            />
          </label>
        </div>

        <label className="field">
          <span className="field-label">Email Address *</span>
          <input
            className="field-input"
            type="email"
            placeholder="email@hospital.org"
            required
            value={form.email}
            onChange={update("email")}
          />
        </label>

        <label className="field">
          <span className="field-label">Country *</span>
          <select className="field-input" required value={form.country} onChange={update("country")}>
            <option value="" disabled>Select your country</option>
            {countries.map((c) => (
              <option key={c.code || c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">Quantity</span>
          <input
            className="field-input"
            placeholder="e.g. 10 Strips, 10 Vials"
            value={form.quantity}
            onChange={update("quantity")}
          />
        </label>

        <label className="field">
          <span className="field-label">Message</span>
          <textarea
            className="field-input field-textarea"
            placeholder="Specific instructions, shipping timelines, preferred manufacturers..."
            value={form.message}
            onChange={update("message")}
          />
        </label>

        {state === "sent" && (
          <div className="captcha-success">
            <span className="captcha-check">✓</span>
            <div>
              <strong>Enquiry sent{reference ? ` — reference #${reference}` : ""}</strong>
              <div className="captcha-brand">
                A confirmation is on its way to your inbox.
              </div>
            </div>
          </div>
        )}

        {state === "error" && <p className="enquiry-guarantee" role="alert">{error}</p>}

        <button
          type="submit"
          className="btn-submit"
          disabled={state === "sending" || state === "sent"}
        >
          <FiSend aria-hidden="true" />
          {state === "sending" ? "Sending…" : state === "sent" ? "Enquiry Sent" : "Submit Enquiry"}
        </button>
        <p className="enquiry-guarantee">Response guaranteed within 24 hours.</p>

        <ul className="enquiry-trust">
          <li><FiShield aria-hidden="true" /> Cold-Chain validated temp logs</li>
          <li><FiFileText aria-hidden="true" /> COA / GMP verification included</li>
          <li><FiLock aria-hidden="true" /> Customs-cleared priority dispatch</li>
        </ul>
      </form>
    </aside>
  );
}

export default function SingleProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, items } = useCart();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | missing | error
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [optionIndex, setOptionIndex] = useState(0);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setActiveImage(0);
    setOptionIndex(0);

    getProductById(id)
      .then((data) => {
        if (!active) return;
        setProduct(data);
        setStatus(data ? "ready" : "missing");
      })
      .catch(() => active && setStatus("error"));

    return () => {
      active = false;
    };
  }, [id]);

  if (status === "loading") {
    return (
      <div className="sp-page">
        <div className="sp-shell"><p>Loading product…</p></div>
      </div>
    );
  }

  if (status !== "ready") {
    return (
      <div className="sp-page">
        <div className="sp-shell">
          <h1 className="sp-title">
            {status === "missing" ? "Product not found" : "Something went wrong"}
          </h1>
          <p>
            {status === "missing"
              ? "This medicine is no longer listed in our formulary."
              : "We could not load this product right now. Please try again shortly."}
          </p>
          <button type="button" className="sp-back" onClick={() => navigate("/shop")}>
            <FiArrowLeft aria-hidden="true" /> Back to Specialty Formulary
          </button>
        </div>
      </div>
    );
  }

  const selectedOption = product.pillOptions[optionIndex] || null;
  const inCart = items.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      image: product.image || "",
      price: selectedOption?.price ?? product.price.min ?? 0,
      optionLabel: selectedOption?.label || "",
    });
    navigate("/cart");
  };

  const hasSideEffects =
    product.commonSideEffects.length > 0 ||
    product.severeSideEffects.length > 0 ||
    Boolean(product.sideEffectsDescription);

  return (
    <div className="sp-page">
      <div className="sp-topbar">
        <button type="button" className="sp-back" onClick={() => navigate(-1)}>
          <FiArrowLeft aria-hidden="true" /> Back to Specialty Formulary
        </button>
        <span className="chip chip-teal">WHO GMP Authenticated Sourcing</span>
      </div>

      <div className="sp-shell">
        <div className="sp-grid">
          <div className="sp-main">
            <div className="sp-gallery">
              {product.images.length > 0 ? (
                <img src={product.images[activeImage]} alt={product.name} />
              ) : (
                <div className="sp-gallery-placeholder">{product.brandLabel || product.name}</div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="sp-badges">
                {product.images.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    className={`chip ${index === activeImage ? "chip-teal" : "chip-yellow"}`}
                    onClick={() => setActiveImage(index)}
                  >
                    View {index + 1}
                  </button>
                ))}
              </div>
            )}

            <div className="sp-badges">
              {product.categoryLabel && (
                <span className="chip chip-teal">{product.categoryLabel}</span>
              )}
              {product.brandLabel && (
                <span className="chip chip-teal">Brand: {product.brandLabel}</span>
              )}
              {product.prescriptionRequired && (
                <span className="chip chip-orange">Prescription Required</span>
              )}
            </div>

            <div className="sp-title-row">
              <h1 className="sp-title">{product.name}</h1>
              <button
                type="button"
                className={`sp-cart-btn ${inCart ? 'sp-cart-btn-added' : ''}`}
                onClick={handleAddToCart}
              >
                {inCart ? 'Added to Cart' : 'Add to Cart'}
              </button>
            </div>

            {product.genericName && (
              <p className="sp-salt">Molecular Salt: {product.genericName}</p>
            )}

            {product.price.label && <p className="sp-salt">Price: {product.price.label}</p>}

            {product.pillOptions.length > 0 && (
              <section className="sp-section">
                <h2>Pack options</h2>
                <div className="sp-badges">
                  {product.pillOptions.map((option, index) => (
                    <button
                      key={option.id ?? `${option.label}-${index}`}
                      type="button"
                      className={`chip ${index === optionIndex ? "chip-teal" : "chip-yellow"}`}
                      onClick={() => setOptionIndex(index)}
                    >
                      {option.label || `Option ${index + 1}`}
                      {option.price != null && ` — $${Number(option.price).toFixed(2)}`}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {product.description && (
              <section className="sp-section">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
              </section>
            )}

            {product.indications.length > 0 && (
              <section className="sp-section">
                <h2>Indication</h2>
                <ul className="sp-list">
                  {product.indications.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
            )}

            {product.benefits.length > 0 && (
              <section className="sp-section">
                <h2>Benefits</h2>
                <ul className="sp-list">
                  {product.benefits.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
            )}

            {hasSideEffects && (
              <section className="sp-section">
                <h2>Side effects</h2>
                <p>
                  {product.sideEffectsDescription ||
                    "Most side effects don't need to be treated by a doctor, and they go away as your body adapts to the medicine. You should consult your doctor if the symptoms continue or if you are concerned."}
                </p>
                {product.commonSideEffects.length > 0 && (
                  <>
                    <h3>Common side effects of {product.name}</h3>
                    <ul className="sp-list sp-list-grid">
                      {product.commonSideEffects.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </>
                )}
                {product.severeSideEffects.length > 0 && (
                  <>
                    <h3>Severe side effects</h3>
                    <ul className="sp-list">
                      {product.severeSideEffects.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </>
                )}
              </section>
            )}

            {product.howToUse && (
              <section className="sp-section">
                <h2>How to use</h2>
                <p>{product.howToUse}</p>
              </section>
            )}

            {product.howItWorks && (
              <section className="sp-section">
                <h2>How it works</h2>
                <p>{product.howItWorks}</p>
              </section>
            )}

            {product.precautions.length > 0 && (
              <section className="sp-section">
                <h2>Precautions</h2>
                {product.precautions.map((p) => (
                  <div key={p.label || p.text} className="sp-subblock">
                    <h3>
                      {p.label}
                      {p.status && (
                        <>
                          {" - "}
                          <span className={`status-tag ${statusClassFor(p.status)}`}>
                            {p.status}
                          </span>
                        </>
                      )}
                    </h3>
                    <p>{p.text}</p>
                  </div>
                ))}
              </section>
            )}

            {product.tips && (
              <section className="sp-section">
                <h2>Tips</h2>
                <p>{product.tips}</p>
              </section>
            )}

            {product.packing && (
              <section className="sp-section">
                <h2>Packing</h2>
                <p className="sp-packing">{product.packing}</p>
              </section>
            )}

            <div className="sp-infogrid">
              {product.clinicalSource && (
                <div>
                  <span className="info-label">Manufacturer</span>
                  <span className="info-value">{product.clinicalSource}</span>
                </div>
              )}
              {product.unitDosage && (
                <div>
                  <span className="info-label">Dosage / Formulation</span>
                  <span className="info-value">{product.unitDosage}</span>
                </div>
              )}
              {product.packSize && (
                <div>
                  <span className="info-label">Packaging Size</span>
                  <span className="info-value">{product.packSize}</span>
                </div>
              )}
              {product.tempTracked && (
                <div>
                  <span className="info-label">Storage Protocol</span>
                  <span className="info-value info-value-danger">🌡 {product.tempTracked}</span>
                </div>
              )}
            </div>
          </div>

          <EnquiryForm product={product} />
        </div>

        <div className="sp-advisory">
          <h3><FiHelpCircle aria-hidden="true" /> Clinical Advisory &amp; Import Compliance</h3>
          <p>
            <strong>Disclaimer:</strong> Unnati Pharmax is a clinical specialty
            supplier and exporter. All enquiries are subject to valid licensing
            verification and import permits standard under target jurisdiction
            guidelines.
          </p>
          <p>
            <strong>Storage Warning:</strong> Biological injectables, biosimilars,
            and active oncology agents are flagged as temperature-sensitive cargo
            and are packed strictly inside thermal containers coupled with
            real-time digital temperature tags.
          </p>
        </div>

        <button
          type="button"
          className="sp-accordion"
          onClick={() => setDisclaimerOpen((v) => !v)}
          aria-expanded={disclaimerOpen}
        >
          <span className="sp-accordion-icon"><FiAlertTriangle aria-hidden="true" /></span>
          <span className="sp-accordion-text">
            <strong>Important Medical Disclaimer &amp; Legal Notices</strong>
            <small>Click to read guidelines on generic drug exports, trademark rights, and patient adherence.</small>
          </span>
          <FiChevronDown className={`sp-accordion-chevron ${disclaimerOpen ? "is-open" : ""}`} aria-hidden="true" />
        </button>
        {disclaimerOpen && (
          <div className="sp-accordion-body">
            <h3>Medical Disclaimer:</h3>
            <p>All content found on the Unnati Pharmax Website, including: text, images, audio, or other formats were created for informational purposes only. Offerings for continuing education credits are clearly identified and the appropriate target audience is identified. The Content is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this Website.</p>
            <p>Unnati Pharmax - Exporters of Generic Medicines. If you think you may have a medical emergency, call your doctor or go to the emergency department, or immediately. Unnati Pharmax does not recommend or endorse any specific tests, physicians, products, procedures, opinions, or other information that may be mentioned on Unnati Pharmax. Reliance on any information provided by Unnati Pharmax, Unnati Pharmax employees, contracted writers, or medical professionals presenting content for publication to Unnati Pharmax is solely at your own risk.</p>
            <p>The Site may contain health- or medical-related materials or discussions regarding sexually explicit disease states. If you find these materials offensive, you may not want to use our Site. The Site and its Content are provided on an "as is" basis. Unnati Pharmax - Exporters of Generic Medicines. Links to educational content not created by Unnati Pharmax are taken at your own risk. Unnati Pharmax is not responsible for the claims of external websites and education companies.</p>
            <h3>General Advisory:</h3>
            <p>We advise you to stick to medication routine (or medication adherence), i.e. to take medications as prescribed – the right dose, at the right time, in the right way and frequency. Not taking medicines as prescribed by a doctor or instructed by a pharmacist could lead to disease getting worse, hospitalization, even death.</p>
            <p>Products protected by valid patents are not offered for sale in countries where the sale of such products constitutes patent infringement. Any liability for patent infringement is at the buyer's risk.</p>
            <p>All Trademarks, Brands and Service marks that appear on this website belong to their respective owner.</p>
          </div>
        )}
      </div>
    </div>
  );
}

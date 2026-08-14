import { useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  Send,
  MessageCircle,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { sendContactMessage } from "../../api/enquiries";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "India",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      const saved = await sendContactMessage({
        name: form.name,
        email: form.email,
        phone: form.phone,
        country: form.country,
        subject: form.subject,
        message: form.message,
      });
      setReference(saved?.id ?? null);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "We could not send your message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="upc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,500;0,600;0,700;1,500&family=Manrope:wght@400;500;600;700;800&display=swap');

        .upc-root {
          --ink: #1A1610;
          --deep: #2A251D;
          --deep-2: #1A1610;
          --mint: #FBF4E6;
          --mint-2: #FFFDF7;
          --gold: #F0AC1B;
          --gold-dark: #8A5A11;
          --line: #E6E0D4;
          --white: #FFFFFF;
          font-family: 'Manrope', sans-serif;
          background: var(--mint-2);
          color: var(--ink);
          min-height: 100vh;
        }
        .upc-root * { box-sizing: border-box; }
        .upc-display { font-family: 'Newsreader', serif; }

        .upc-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 32px;
          border-bottom: 1px solid var(--line);
        }
        .upc-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .upc-mark {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--deep);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
          font-family: 'Newsreader', serif;
          font-weight: 700;
          font-size: 18px;
        }
        .upc-brand-text {
          font-family: 'Newsreader', serif;
          font-weight: 600;
          font-size: 19px;
          color: var(--deep-2);
          letter-spacing: 0.2px;
        }
        .upc-brand-sub {
          font-size: 10.5px;
          letter-spacing: 2px;
          color: var(--gold-dark);
          font-weight: 700;
          text-transform: uppercase;
        }
        .upc-navlinks {
          display: flex;
          gap: 32px;
          font-size: 14.5px;
          font-weight: 600;
          color: #423C31;
        }
        .upc-navlinks span.active { color: var(--deep-2); }
        .upc-navlinks { display: none; }
        @media (min-width: 860px) {
          .upc-navlinks { display: flex; }
        }
        .upc-cta-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--deep);
          color: white;
          border: none;
          padding: 11px 20px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 13.5px;
          cursor: pointer;
        }

        .upc-hero {
          position: relative;
          padding: 64px 32px 40px;
          text-align: center;
          overflow: hidden;
          background: radial-gradient(ellipse at 50% 0%, var(--mint) 0%, var(--mint-2) 70%);
        }
        .upc-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          color: var(--gold-dark);
          text-transform: uppercase;
          background: #FEF0CE;
          padding: 7px 16px;
          border-radius: 999px;
          margin-bottom: 26px;
        }
        .upc-hero h1 {
          font-size: clamp(38px, 6vw, 62px);
          line-height: 1.05;
          font-weight: 600;
          color: var(--deep-2);
          margin: 0 0 18px;
        }
        .upc-hero h1 em {
          font-style: italic;
          color: var(--gold-dark);
        }
        .upc-hero p {
          max-width: 560px;
          margin: 0 auto;
          color: #5C5445;
          font-size: 16.5px;
          line-height: 1.6;
        }

        .upc-map-panel {
          grid-column: 1 / -1;
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid var(--line);
          background: var(--mint-2);
        }
        .upc-map-panel iframe {
          width: 100%;
          height: 340px;
          border: 0;
          display: block;
        }
        .upc-map-label {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 24px;
        }
        .upc-map-label h3 {
          font-family: 'Newsreader', serif;
          font-size: 19px;
          font-weight: 600;
          color: var(--deep-2);
          margin: 0;
        }
        .upc-map-label p {
          margin: 2px 0 0;
          font-size: 13px;
          color: #5C5445;
        }

        .upc-wrap {
          max-width: 1120px;
          margin: 0 auto;
          padding: 8px 32px 80px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
        }
        @media (min-width: 900px) {
          .upc-wrap { grid-template-columns: 0.85fr 1.15fr; gap: 32px; }
        }

        .upc-panel-dark {
          background: var(--mint);
          border: 1px solid var(--line);
          border-top: 3px solid var(--gold);
          border-radius: 22px;
          padding: 40px 32px;
          color: var(--ink);
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .upc-panel-title {
          font-family: 'Newsreader', serif;
          font-size: 24px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .upc-icon-chip {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #FEF0CE;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold-dark);
          flex-shrink: 0;
        }
        .upc-info-row { display: flex; gap: 14px; align-items: flex-start; }
        .upc-info-label {
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #7D7361;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .upc-info-value {
          font-size: 15.5px;
          font-weight: 600;
          line-height: 1.5;
          color: var(--ink);
        }
        .upc-phones {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 18px;
        }
        .upc-divider { height: 1px; background: var(--line); }
        .upc-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          font-weight: 700;
          color: var(--gold-dark);
        }

        .upc-form-panel {
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: 22px;
          padding: 40px 34px;
        }
        .upc-form-panel h2 {
          font-family: 'Newsreader', serif;
          font-size: 26px;
          font-weight: 600;
          color: var(--deep-2);
          margin: 0 0 6px;
        }
        .upc-form-panel > p {
          color: #5C5445;
          font-size: 14.5px;
          margin: 0 0 28px;
        }
        .upc-grid2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }
        @media (min-width: 560px) {
          .upc-grid2 { grid-template-columns: 1fr 1fr; }
        }
        .upc-field label {
          display: block;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #423C31;
          margin-bottom: 8px;
        }
        .upc-field label sup { color: var(--gold-dark); }
        .upc-field input,
        .upc-field textarea,
        .upc-field select {
          width: 100%;
          border: 1.5px solid var(--line);
          background: white;
          border-radius: 11px;
          padding: 12px 14px;
          font-size: 14.5px;
          font-family: 'Manrope', sans-serif;
          color: var(--ink);
          outline: none;
          transition: border-color 0.15s ease;
        }
        .upc-field input:focus,
        .upc-field textarea:focus,
        .upc-field select:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(240, 172, 27, 0.18);
        }
        .upc-field textarea { resize: vertical; min-height: 110px; }
        .upc-row { margin-top: 18px; }
        .upc-select-wrap { position: relative; }
        .upc-select-wrap select { appearance: none; padding-right: 36px; }
        .upc-select-wrap svg {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #7D7361;
        }

        .upc-submit {
          margin-top: 24px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: var(--gold);
          color: var(--ink);
          border: none;
          border-radius: 12px;
          padding: 15px;
          font-weight: 800;
          font-size: 14.5px;
          letter-spacing: 0.4px;
          cursor: pointer;
          transition: background 0.15s ease, box-shadow 0.15s ease;
        }
        .upc-submit:hover {
          background: #F5BA38;
          box-shadow: 0 8px 24px rgba(240, 172, 27, 0.28);
        }
        .upc-submit-note {
          text-align: center;
          font-size: 12.5px;
          color: #7D7361;
          margin-top: 12px;
        }
        .upc-success {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #EAF6EC;
          border: 1px solid #BFE3CE;
          color: #1F6B3B;
          font-weight: 700;
          font-size: 14px;
          padding: 13px 16px;
          border-radius: 11px;
          margin-top: 20px;
        }

        .upc-footer-note {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 32px 60px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
          color: #5C5445;
          font-size: 13px;
        }
        .upc-footer-note .upc-icon-chip {
          background: #FEF0CE;
          color: var(--gold-dark);
          width: 34px;
          height: 34px;
          border-radius: 10px;
        }
      `}</style>


      <header className="upc-hero">
        <span className="upc-eyebrow">
          <MessageCircle size={13} /> Send an inquiry
        </span>
        <h1 className="upc-display">
          Contact Us
        </h1>
        <p>
          Questions about our formulations, exports, or bulk pricing? Fill out
          the form below or reach our team directly — we&apos;re here to help.
        </p>
      </header>

      <main className="upc-wrap">
        <section className="upc-panel-dark">
          <div className="upc-panel-title">
            <span className="upc-icon-chip">
              <MapPin size={18} />
            </span>
            Our Office
          </div>

          <div className="upc-info-row">
            <span className="upc-icon-chip">
              <MapPin size={17} />
            </span>
            <div>
              <div className="upc-info-label">Address</div>
              <div className="upc-info-value">
                Ground Floor, House No 307/4, Guru Vandana Apartment,
                <br />
                Kakasaheb Cholkar Marg, Lakadganj,
                <br />
                Nagpur – 440008, Maharashtra, India
              </div>
            </div>
          </div>

          <div className="upc-info-row">
            <span className="upc-icon-chip">
              <Mail size={17} />
            </span>
            <div>
              <div className="upc-info-label">Email Address</div>
              <div className="upc-info-value">unnatipharmax@gmail.com</div>
            </div>
          </div>

          <div className="upc-info-row">
            <span className="upc-icon-chip">
              <Phone size={17} />
            </span>
            <div style={{ flex: 1 }}>
              <div className="upc-info-label">Phone Numbers</div>
              <div className="upc-phones">
                <div className="upc-info-value">+91-82650 41513</div>
              </div>
            </div>
          </div>

          <div className="upc-divider" />

          <div className="upc-info-row">
            <span className="upc-icon-chip">
              <Clock size={17} />
            </span>
            <div>
              <div className="upc-info-label">Working Hours</div>
              <div className="upc-info-value">Monday – Saturday, 9am–7pm</div>
            </div>
          </div>

          <div className="upc-divider" />

          <span className="upc-badge">
            <ShieldCheck size={16} /> WHO-GMP Certified &amp; Genuine Formulations
          </span>
        </section>

        <section className="upc-form-panel">
          <h2>Send Us a Message</h2>
          <p>Fill out this form to ask about any product or bulk order.</p>

          {submitted ? (
            <div className="upc-success">
              <CheckCircle2 size={19} />
              <span>
                Thanks — your message has reached our team and we will reply
                within a few hours.
                {reference && <> Your reference is <strong>#{reference}</strong>.</>}
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="upc-grid2">
                <div className="upc-field">
                  <label>
                    Name <sup>*</sup>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="upc-field">
                  <label>
                    Email <sup>*</sup>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div className="upc-grid2 upc-row">
                <div className="upc-field">
                  <label>
                    Phone Number <sup>*</sup>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div className="upc-field">
                  <label>
                    Destination Country <sup>*</sup>
                  </label>
                  <div className="upc-select-wrap">
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                    >
                      <option>India</option>
                      <option>United States</option>
                      <option>United Arab Emirates</option>
                      <option>Nigeria</option>
                      <option>Philippines</option>
                      <option>Other</option>
                    </select>
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div className="upc-field upc-row">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What is this inquiry about?"
                />
              </div>

              <div className="upc-field upc-row">
                <label>
                  Your Message <sup>*</sup>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="List the products you need or ask your questions here…"
                  required
                />
              </div>

              <button type="submit" className="upc-submit" disabled={sending}>
                <Send size={16} /> {sending ? "Sending…" : "Send Inquiry"}
              </button>
              <div className="upc-submit-note" role={error ? "alert" : undefined}>
                {error || "We will review your message and reply as soon as possible."}
              </div>
            </form>
          )}
        </section>

        <section className="upc-map-panel">
          <div className="upc-map-label">
            <span className="upc-icon-chip" style={{ background: "#FEF0CE", color: "var(--gold-dark)" }}>
              <MapPin size={17} />
            </span>
            <div>
              <h3>Find Us</h3>
              <p>Unnati Pharmax on Google Maps</p>
            </div>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.0337259048288!2d79.12212287556143!3d21.151056080529084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c7ac163fe829%3A0xb602854cf4c983c1!2sUnnati%20Pharmax!5e0!3m2!1sen!2sin!4v1785663294746!5m2!1sen!2sin"
            title="Unnati Pharma location"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </section>
      </main>

      <div className="upc-footer-note">
        <span className="upc-icon-chip">
          <ShieldCheck size={16} />
        </span>
        <div>
          <strong style={{ color: "#2A251D" }}>
            Important Medical Disclaimer &amp; Legal Notices
          </strong>
          <div>
            Click to read guidelines on generic drug exports, trademark
            rights, and patient adherence.
          </div>
        </div>
      </div>
    </div>
  );
}
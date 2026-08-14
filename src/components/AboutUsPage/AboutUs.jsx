import { useState } from "react";
import {
  Award,
  DollarSign,
  Globe2,
  Users,
  Heart,
  ShieldCheck,
  Truck,
  Activity,
  ChevronDown,
} from "lucide-react";

const whyCards = [
  {
    icon: Globe2,
    title: "Local Reach, Real Trust",
    text: "Built on relationships with pharmacies and partners who count on us order after order.",
  },
  {
    icon: Users,
    title: "Reliable Manufacturer Ties",
    text: "Working with established, quality-focused manufacturers to keep supply consistent.",
  },
  {
    icon: Heart,
    title: "Growing Product Range",
    text: "A widening portfolio covering essential, generic, and specialty medicine needs.",
  },
  {
    icon: ShieldCheck,
    title: "Genuine, Quality-Assured Stock",
    text: "Every product handled with care, so what reaches you is exactly what it claims to be.",
  },
  {
    icon: Truck,
    title: "Dependable Distribution",
    text: "Consistent, well-tracked deliveries that partners can plan their stock around.",
  },
  {
    icon: Award,
    title: "Responsive Support",
    text: "A team that's easy to reach, quick to respond, and easy to work with.",
  },
  {
    icon: Activity,
    title: "Ready When You Need Us",
    text: "Equipped to support urgent restocking and bulk orders as your needs grow.",
    wide: true,
  },
];

const portfolioCards = [
  {
    title: "Essential Medicines",
    text: "Reliable stock of everyday essential and life-saving formulations.",
  },
  {
    title: "Generic Medicines",
    text: "Affordable, genuine alternatives to branded drugs.",
  },
  {
    title: "Specialty Medicines",
    text: "Targeted formulations for chronic and complex health conditions.",
  },
  {
    title: "Wellness & OTC Range",
    text: "Everyday health and wellness products for pharmacy shelves.",
  },
];

export default function UnnatiPharmaAbout() {
  const [activeWhy, setActiveWhy] = useState(null);
  const [activePortfolio, setActivePortfolio] = useState(null);

  return (
    <div className="uap-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,500;0,600;0,700;1,500&family=Manrope:wght@400;500;600;700;800&display=swap');

        .uap-root {
          --ink: #1A1610;
          --deep: #2A251D;
          --deep-2: #1A1610;
          --mint: #FBF4E6;
          --mint-2: #FFFDF7;
          --amber-tint: #FDF3DF;
          --gold: #F0AC1B;
          --gold-dark: #8A5A11;
          --line: #E6E0D4;
          --white: #FFFFFF;
          font-family: 'Manrope', sans-serif;
          background: var(--mint-2);
          color: var(--ink);
          min-height: 100vh;
        }
        .uap-root * { box-sizing: border-box; }
        .uap-display { font-family: 'Newsreader', serif; }

        /* Nav */
        .uap-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 32px;
          border-bottom: 1px solid var(--line);
        }
        .uap-brand { display: flex; align-items: center; gap: 10px; }
        .uap-mark {
          width: 38px; height: 38px; border-radius: 50%;
          background: var(--deep); display: flex; align-items: center;
          justify-content: center; color: var(--gold);
          font-family: 'Newsreader', serif; font-weight: 700; font-size: 18px;
        }
        .uap-brand-text {
          font-family: 'Newsreader', serif; font-weight: 600; font-size: 19px;
          color: var(--deep-2);
        }
        .uap-brand-sub {
          font-size: 10.5px; letter-spacing: 2px; color: var(--gold-dark);
          font-weight: 700; text-transform: uppercase;
        }
        .uap-navlinks { display: none; gap: 32px; font-size: 14.5px; font-weight: 600; color: #423C31; }
        @media (min-width: 860px) { .uap-navlinks { display: flex; } }
        .uap-navlinks span.active { color: var(--deep-2); }
        .uap-cta-pill {
          display: flex; align-items: center; gap: 8px; background: var(--deep);
          color: white; border: none; padding: 11px 20px; border-radius: 999px;
          font-weight: 700; font-size: 13.5px; cursor: pointer;
        }

        /* Section shell */
        .uap-section { max-width: 1120px; margin: 0 auto; padding: 72px 32px; }
        .uap-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11.5px; font-weight: 800; letter-spacing: 1.6px;
          color: var(--deep-2); text-transform: uppercase;
          background: #FEF0CE; padding: 7px 16px; border-radius: 999px;
          margin-bottom: 18px;
        }
        .uap-eyebrow.on-dark { background: #FEF0CE; color: var(--gold-dark); }
        .uap-h2 {
          font-family: 'Newsreader', serif; font-weight: 600;
          font-size: clamp(28px, 3.6vw, 40px); color: var(--deep-2);
          margin: 0 0 18px; line-height: 1.15;
        }
        .uap-h2.on-dark { color: var(--ink); }
        .uap-lead { color: #5C5445; font-size: 16px; line-height: 1.7; max-width: 760px; }

        /* Hero */
        .uap-hero {
          background: radial-gradient(ellipse at 50% 0%, #FFF9EC 0%, var(--mint-2) 70%);
          border-bottom: 1px solid var(--line);
          padding: 68px 32px 0;
          text-align: center;
          color: var(--ink);
        }
        .uap-hero .uap-eyebrow {
          background: #FEF0CE; color: var(--gold-dark);
        }
        .uap-hero h1 {
          font-family: 'Newsreader', serif; font-weight: 600;
          font-size: clamp(36px, 6vw, 58px); margin: 0 0 20px; line-height: 1.08;
        }
        .uap-hero p {
          max-width: 640px; margin: 0 auto; font-size: 16.5px;
          line-height: 1.65; color: #5C5445;
        }
        .uap-pillars {
          max-width: 1080px; margin: 44px auto 0; padding: 0 0;
          display: grid; grid-template-columns: 1fr; gap: 20px;
          transform: translateY(48px);
        }
        @media (min-width: 860px) {
          .uap-pillars { grid-template-columns: 1fr 1fr 1fr; }
        }
        .uap-pillar-card {
          background: white; border-radius: 18px; padding: 30px 28px;
          text-align: left; box-shadow: 0 20px 40px -20px rgba(26,22,16,0.35);
        }
        .uap-pillar-icon {
          width: 44px; height: 44px; border-radius: 12px; background: var(--mint);
          display: flex; align-items: center; justify-content: center;
          color: var(--deep); margin-bottom: 18px;
        }
        .uap-pillar-card h3 {
          font-family: 'Newsreader', serif; font-size: 21px; font-weight: 600;
          color: var(--deep-2); margin: 0 0 4px;
        }
        .uap-pillar-tag {
          font-size: 10.5px; font-weight: 800; letter-spacing: 1.2px;
          text-transform: uppercase; color: var(--gold-dark); margin-bottom: 12px;
        }
        .uap-pillar-card p { font-size: 14.5px; color: #5C5445; line-height: 1.6; margin: 0 0 14px; }
        .uap-pillar-quote {
          font-style: italic; font-weight: 600; color: var(--deep-2); font-size: 14px; margin: 0;
        }
        .uap-hero-spacer { height: 90px; }

        /* Intro two-col */
        .uap-intro-grid {
          display: grid; grid-template-columns: 1fr; gap: 22px; margin-top: 34px;
        }
        @media (min-width: 800px) { .uap-intro-grid { grid-template-columns: 1fr 1fr; } }
        .uap-card-white {
          background: white; border: 1px solid var(--line); border-radius: 18px;
          padding: 30px 30px;
        }
        .uap-card-label {
          font-size: 11.5px; font-weight: 800; letter-spacing: 1.2px;
          text-transform: uppercase; color: var(--deep); margin-bottom: 12px;
        }
        .uap-card-label.on-dark { color: var(--gold-dark); }
        .uap-card-white p { font-size: 15px; color: #423C31; line-height: 1.65; margin: 0; }
        .uap-card-dark {
          background: var(--mint);
          border: 1px solid var(--line);
          border-radius: 18px; padding: 30px 30px; color: var(--ink);
          border-left: 6px solid var(--gold);
        }
        .uap-card-dark p { font-size: 16px; font-style: italic; line-height: 1.65; color: #423C31; margin: 0; }

        /* Mission & Vision */
        .uap-mv-grid { display: grid; grid-template-columns: 1fr; gap: 22px; }
        @media (min-width: 800px) { .uap-mv-grid { grid-template-columns: 1fr 1fr; } }
        .uap-mv-card {
          border-radius: 20px; padding: 34px 32px;
        }
        .uap-mv-card.light { background: white; border: 1px solid var(--line); }
        .uap-mv-card.dark { background: var(--mint); border: 1px solid var(--line); border-top: 3px solid var(--gold); color: var(--ink); }
        .uap-mv-title { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
        .uap-mv-badge {
          width: 34px; height: 34px; border-radius: 9px; background: var(--gold);
          color: var(--deep-2); font-weight: 800; font-family: 'Newsreader', serif;
          display: flex; align-items: center; justify-content: center; font-size: 16px;
        }
        .uap-mv-title h3 {
          font-family: 'Newsreader', serif; font-size: 24px; font-weight: 600; margin: 0;
        }
        .uap-mv-card.light p { color: #5C5445; font-size: 15px; line-height: 1.65; }
        .uap-mv-card.dark p { color: #5C5445; font-size: 15px; line-height: 1.65; }
        .uap-mv-divider { height: 1px; background: var(--line); margin: 22px 0 16px; }
        .uap-mv-card.dark .uap-mv-divider { background: #E6E0D4; }
        .uap-mv-list-label {
          font-size: 11px; font-weight: 800; letter-spacing: 1.4px;
          text-transform: uppercase; color: #423C31; margin-bottom: 12px;
        }
        .uap-mv-card.dark .uap-mv-list-label { color: var(--gold-dark); }
        .uap-mv-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .uap-mv-list li { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 600; color: var(--deep-2); }
        .uap-mv-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--gold-dark); flex-shrink: 0; }
        .uap-mv-quote-label {
          font-size: 11px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase;
          color: var(--gold-dark); margin-bottom: 10px;
        }
        .uap-mv-quote { font-family: 'Newsreader', serif; font-size: 20px; font-style: italic; font-weight: 600; color: var(--ink); margin: 0; }

        /* Global demand */
        .uap-gd-grid { display: grid; grid-template-columns: 1fr; gap: 26px; }
        @media (min-width: 920px) { .uap-gd-grid { grid-template-columns: 0.9fr 1.1fr; } }
        .uap-gd-list { display: flex; flex-direction: column; gap: 14px; margin-top: 26px; }
        .uap-gd-item {
          display: flex; align-items: center; gap: 16px; padding: 18px 20px;
          border-radius: 14px; border: 1px solid var(--line); background: white;
        }
        .uap-gd-item.active {
          background: var(--amber-tint);
          border-color: var(--gold); color: var(--ink);
        }
        .uap-gd-icon {
          width: 42px; height: 42px; border-radius: 11px; background: var(--mint);
          display: flex; align-items: center; justify-content: center; color: var(--deep);
          flex-shrink: 0;
        }
        .uap-gd-item.active .uap-gd-icon { background: var(--gold); color: var(--ink); }
        .uap-gd-item h4 { font-size: 15.5px; font-weight: 700; margin: 0 0 2px; }
        .uap-gd-item p { font-size: 12.5px; margin: 0; color: #5C5445; }
        .uap-gd-item.active p { color: #E6E0D4; }
        .uap-gd-panel {
          background: var(--mint-2); border: 1px solid var(--line); border-radius: 20px;
          padding: 32px 30px;
        }
        .uap-gd-panel-eyebrow {
          font-size: 11px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase;
          color: var(--deep); margin-bottom: 10px;
        }
        .uap-gd-panel h3 {
          font-family: 'Newsreader', serif; font-size: 24px; font-weight: 600;
          color: var(--deep-2); margin: 0 0 22px;
        }
        .uap-gd-bullets { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 480px) { .uap-gd-bullets { grid-template-columns: 1fr; } }
        .uap-gd-bullet {
          background: white; border: 1px solid var(--line); border-radius: 12px;
          padding: 16px 18px; font-size: 14px; font-weight: 700; color: var(--deep-2);
          display: flex; align-items: center; gap: 10px;
        }
        .uap-gd-tags {
          display: flex; flex-wrap: wrap; gap: 8px 16px; margin-top: 24px;
          padding-top: 20px; border-top: 1px solid var(--line);
          font-size: 13px; font-weight: 600; color: #5C5445;
        }
        .uap-gd-tags span:not(:last-child)::after { content: '•'; margin-left: 16px; color: var(--gold-dark); }

        /* Why choose grid */
        .uap-why-grid { display: grid; grid-template-columns: 1fr; gap: 18px; }
        @media (min-width: 700px) { .uap-why-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 980px) { .uap-why-grid { grid-template-columns: 1fr 1fr 1fr; } }
        .uap-why-card {
          background: white; border: 1px solid var(--line); border-radius: 16px; padding: 26px 24px;
          cursor: pointer; transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background 0.18s ease;
        }
        .uap-why-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 34px -18px rgba(26,22,16,0.28);
          border-color: var(--gold);
        }
        .uap-why-card.is-active {
          background: var(--amber-tint);
          border-color: var(--gold);
          box-shadow: 0 18px 34px -18px rgba(240,172,27,0.45);
        }
        .uap-why-icon {
          width: 42px; height: 42px; border-radius: 11px; background: var(--mint);
          display: flex; align-items: center; justify-content: center; color: var(--deep);
          margin-bottom: 16px; transition: background 0.18s ease, color 0.18s ease;
        }
        .uap-why-card h4 { font-size: 16px; font-weight: 700; color: var(--deep-2); margin: 0 0 6px; transition: color 0.18s ease; }
        .uap-why-card p { font-size: 14px; color: #5C5445; line-height: 1.55; margin: 0; transition: color 0.18s ease; }
        .uap-why-card.is-active .uap-why-icon { background: var(--gold); color: var(--ink); }
        .uap-why-card.is-active h4 { color: var(--ink); }
        .uap-why-card.is-active p { color: #423C31; }
        .uap-why-wide { grid-column: 1 / -1; display: flex; align-items: center; gap: 18px; }
        .uap-why-wide .uap-why-icon { margin-bottom: 0; background: #FEF0CE; color: var(--gold-dark); }
        .uap-why-wide.is-active .uap-why-icon { background: var(--gold); color: var(--ink); }

        /* Portfolio */
        .uap-portfolio-grid { display: grid; grid-template-columns: 1fr; gap: 18px; }
        @media (min-width: 640px) { .uap-portfolio-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1000px) { .uap-portfolio-grid { grid-template-columns: repeat(4, 1fr); } }
        .uap-portfolio-card {
          background: var(--mint-2); border: 1px solid var(--line); border-radius: 16px;
          padding: 26px 22px; cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background 0.18s ease;
        }
        .uap-portfolio-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 34px -18px rgba(26,22,16,0.28);
          border-color: var(--gold);
        }
        .uap-portfolio-card.is-active {
          background: var(--amber-tint);
          border-color: var(--gold);
          box-shadow: 0 18px 34px -18px rgba(240,172,27,0.45);
        }
        .uap-portfolio-card h4 {
          font-family: 'Newsreader', serif; font-weight: 600; font-size: 19px;
          color: var(--deep); margin: 0 0 10px; transition: color 0.18s ease;
        }
        .uap-portfolio-card p { font-size: 14px; color: #5C5445; line-height: 1.55; margin: 0; transition: color 0.18s ease; }
        .uap-portfolio-card.is-active h4 { color: var(--gold-dark); }
        .uap-portfolio-card.is-active p { color: #423C31; }

        /* CTA band */
        .uap-cta-band {
          background: var(--mint);
          border: 1px solid var(--line);
          border-left: 6px solid var(--gold);
          border-radius: 26px; padding: 56px 48px; color: var(--ink); position: relative; overflow: hidden;
        }
        .uap-cta-band::after {
          content: ''; position: absolute; right: -60px; top: -60px; width: 260px; height: 260px;
          border-radius: 50%; border: 1px solid rgba(240,172,27,0.35);
        }
        .uap-cta-band .uap-eyebrow { background: #FEF0CE; color: var(--gold-dark); }
        .uap-cta-band h2 { color: var(--ink); max-width: 560px; }
        .uap-cta-band p { color: #5C5445; max-width: 560px; font-size: 15.5px; line-height: 1.65; margin: 0 0 28px; }
        .uap-cta-btn {
          background: var(--gold); color: var(--deep-2); border: none; padding: 15px 26px;
          border-radius: 10px; font-weight: 800; font-size: 13px; letter-spacing: 0.6px;
          text-transform: uppercase; cursor: pointer;
        }

        .uap-disclaimer {
          max-width: 1120px; margin: 0 auto; padding: 0 32px 60px;
          border: 1px solid var(--line); border-radius: 14px; background: var(--mint-2);
          padding: 18px 22px; display: flex; align-items: center; justify-content: space-between;
          gap: 16px; margin-top: -30px; margin-left: 32px; margin-right: 32px;
        }
        .uap-disclaimer-left { display: flex; align-items: flex-start; gap: 14px; }
        .uap-disclaimer h5 { margin: 0 0 4px; font-size: 14.5px; color: var(--deep-2); }
        .uap-disclaimer p { margin: 0; font-size: 12.5px; color: #5C5445; }
        .uap-disclaimer-icon {
          width: 34px; height: 34px; border-radius: 10px; background: #FEF0CE; color: var(--gold-dark);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
      `}</style>



      {/* HERO */}
      <header className="uap-hero">
        <span className="uap-eyebrow">About • Unnati Pharma</span>
        <h1 className="uap-display">Built on Trust, Driven by Growth</h1>
        <p>
          A dependable pharmaceutical trading and distribution company
          committed to genuine formulations, transparent sourcing, and
          reliable delivery — helping healthcare reach the people who need it.
        </p>

        <div className="uap-pillars">
          <div className="uap-pillar-card">
            <div className="uap-pillar-icon">
              <Award size={20} />
            </div>
            <div className="uap-pillar-tag">Unbeatable Standards</div>
            <h3>Quality</h3>
            <p>
              Every product we distribute is checked against strict quality
              benchmarks before it reaches our partners.
            </p>
            <p className="uap-pillar-quote">
              &ldquo;Uncompromised quality and assured safety&rdquo;
            </p>
          </div>
          <div className="uap-pillar-card">
            <div className="uap-pillar-icon">
              <DollarSign size={20} />
            </div>
            <div className="uap-pillar-tag">Access to Healthcare</div>
            <h3>Affordability</h3>
            <p>
              Fair, transparent pricing that keeps essential medicines within
              reach for pharmacies, hospitals, and patients alike.
            </p>
          </div>
          <div className="uap-pillar-card">
            <div className="uap-pillar-icon">
              <Globe2 size={20} />
            </div>
            <div className="uap-pillar-tag">Growing Reach</div>
            <h3>Availability</h3>
            <p>
              Steadily expanding our distribution network so genuine
              medicines are never far from where they're needed.
            </p>
          </div>
        </div>
        <div className="uap-hero-spacer" />
      </header>

      {/* INTRO */}
      <section className="uap-section">
        <span className="uap-eyebrow">About Unnati Pharma</span>
        <h2 className="uap-h2">
          A Growing Name in Pharmaceutical Trading &amp; Distribution
        </h2>
        <p className="uap-lead">
          Based in Nagpur, Unnati Pharma works with pharmacies, hospitals, and
          healthcare partners to make genuine medicines more accessible.
          We focus on building dependable supply relationships rather than
          chasing volume alone — every order is handled with the same
          attention, whether it's a single pharmacy or a bulk consignment.
        </p>
        <p className="uap-lead" style={{ marginTop: 14 }}>
          Working closely with established manufacturers, we help bridge the
          gap between production and the people who rely on consistent access
          to essential and specialty medicines.
        </p>

        <div className="uap-intro-grid">
          <div className="uap-card-white">
            <div className="uap-card-label">Authentic Healthcare Solutions</div>
            <p>
              Unnati Pharma: Committed to Authentic Healthcare Solutions for
              Every Need. Keeping patients' well-being at the core, we strive
              to deliver affordable, genuine medications with assured quality.
            </p>
          </div>
          <div className="uap-card-dark">
            <div className="uap-card-label on-dark">Sourcing Credibility</div>
            <p>
              &ldquo;Your dependable partner in pharmaceutical distribution —
              built on trust, sourced with care, and delivered on time.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="uap-section" style={{ background: 'var(--mint-2)' }}>
        <span className="uap-eyebrow">Our Standards</span>
        <h2 className="uap-h2">Our Mission &amp; Vision</h2>

        <div className="uap-mv-grid">
          <div className="uap-mv-card light">
            <div className="uap-mv-title">
              <span className="uap-mv-badge">M</span>
              <h3>Mission</h3>
            </div>
            <p>
              To make genuine, quality medicines accessible and affordable for
              every pharmacy and patient we serve, by building honest,
              dependable supply partnerships.
            </p>
            <div className="uap-mv-divider" />
            <div className="uap-mv-list-label">Our Three-Step Assurance</div>
            <ul className="uap-mv-list">
              <li>
                <span className="uap-mv-dot" /> Assured quality
              </li>
              <li>
                <span className="uap-mv-dot" /> Affordability
              </li>
              <li>
                <span className="uap-mv-dot" /> Accessibility
              </li>
            </ul>
          </div>

          <div className="uap-mv-card dark">
            <div className="uap-mv-title">
              <span className="uap-mv-badge">V</span>
              <h3>Vision</h3>
            </div>
            <p>
              To grow into a trusted regional name in pharmaceutical
              distribution, known for reliability and integrity — steadily
              expanding our reach while never compromising on authenticity.
            </p>
            <div className="uap-mv-divider" />
            <div className="uap-mv-quote-label">Our Approach</div>
            <p className="uap-mv-quote">
              &ldquo;Growth built one trusted delivery at a time.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* GLOBAL / SOURCING DEMAND */}
      <section className="uap-section">
        <div className="uap-gd-grid">
          <div>
            <span className="uap-eyebrow">Growing Demand</span>
            <h2 className="uap-h2">Meeting Sourcing Demands</h2>
            <p className="uap-lead">
              Committed to equitable healthcare access, we work to keep our
              partner pharmacies stocked and reliable — supporting
              distribution across Nagpur and the wider Maharashtra region,
              with capacity to grow further as demand rises.
            </p>

            <div className="uap-gd-list">
              <div className="uap-gd-item active">
                <span className="uap-gd-icon">
                  <Truck size={19} />
                </span>
                <div>
                  <h4>Our Reliable Logistics</h4>
                  <p>Ensuring safe, on-time transport integrity.</p>
                </div>
              </div>
              <div className="uap-gd-item">
                <span className="uap-gd-icon">
                  <Users size={19} />
                </span>
                <div>
                  <h4>Responsive Partner Support</h4>
                  <p>Ensuring timely response standards.</p>
                </div>
              </div>
              <div className="uap-gd-item">
                <span className="uap-gd-icon">
                  <Activity size={19} />
                </span>
                <div>
                  <h4>Meeting Sourcing Demands</h4>
                  <p>Proficient in meeting growing local demand.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="uap-gd-panel">
            <div className="uap-gd-panel-eyebrow">Our Supply Chain Ensures</div>
            <h3>Our Reliable Supply Chain Ensures</h3>
            <div className="uap-gd-bullets">
              <div className="uap-gd-bullet">
                <span className="uap-mv-dot" style={{ background: "var(--deep)" }} />
                Careful stock handling
              </div>
              <div className="uap-gd-bullet">
                <span className="uap-mv-dot" style={{ background: "var(--deep)" }} />
                Timely delivery
              </div>
              <div className="uap-gd-bullet">
                <span className="uap-mv-dot" style={{ background: "var(--deep)" }} />
                Maintaining product integrity
              </div>
              <div className="uap-gd-bullet">
                <span className="uap-mv-dot" style={{ background: "var(--deep)" }} />
                Consistent order tracking
              </div>
            </div>
            <div className="uap-gd-tags">
              <span>Nagpur</span>
              <span>Vidarbha Region</span>
              <span>Maharashtra</span>
              <span>Growing Network</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="uap-section" style={{ background: 'var(--mint-2)' }}>
        <span className="uap-eyebrow">Why Partner With Us</span>
        <h2 className="uap-h2">Why choose Unnati Pharma?</h2>

        <div className="uap-why-grid">
          {whyCards.map((card, i) => {
            const Icon = card.icon;
            const isActive = activeWhy === i;
            const className = [
              "uap-why-card",
              card.wide ? "uap-why-wide" : "",
              isActive ? "is-active" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div
                key={card.title}
                className={className}
                onClick={() => setActiveWhy(isActive ? null : i)}
              >
                <div className="uap-why-icon">
                  <Icon size={19} />
                </div>
                {card.wide ? (
                  <div>
                    <h4>{card.title}</h4>
                    <p>{card.text}</p>
                  </div>
                ) : (
                  <>
                    <h4>{card.title}</h4>
                    <p>{card.text}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="uap-section">
        <span className="uap-eyebrow">Portfolio</span>
        <h2 className="uap-h2">Our Products &amp; Services</h2>

        <div className="uap-portfolio-grid">
          {portfolioCards.map((card, i) => {
            const isActive = activePortfolio === i;
            return (
              <div
                key={card.title}
                className={`uap-portfolio-card${isActive ? " is-active" : ""}`}
                onClick={() => setActivePortfolio(isActive ? null : i)}
              >
                <h4>{card.title}</h4>
                <p>{card.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA BAND */}
      <section className="uap-section" style={{ paddingTop: 0 }}>
        <div className="uap-cta-band">
          <span className="uap-eyebrow on-dark">Driving Excellence Inside Out</span>
          <h2 className="uap-h2 on-dark uap-display">
            Driving Excellence Inside Out
          </h2>
          <p>
            Your dependable partner in healthcare — Unnati Pharma is built on
            trust, quality, and authenticity. From sourcing genuine medicines
            to reliable delivery, we're committed to excellence in every
            order we handle.
          </p>
          <button className="uap-cta-btn">Consult Sourcing Feasibility</button>
        </div>
      </section>

      {/* DISCLAIMER */}
      <div className="uap-disclaimer">
        <div className="uap-disclaimer-left">
          <span className="uap-disclaimer-icon">
            <ShieldCheck size={17} />
          </span>
          <div>
            <h5>Important Medical Disclaimer &amp; Legal Notices</h5>
            <p>Click to read guidelines on generic drug distribution, trademark rights, and patient adherence.</p>
          </div>
        </div>
        <ChevronDown size={18} color="#5C5445" />
      </div>
    </div>
  );
}
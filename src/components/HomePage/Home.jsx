import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import WaveText from "../common/WaveText";
import {
  Dna,
  Syringe,
  ShieldCheck,
  HeartPulse,
  Activity,
  Wind,
  Heart,
  Sparkles,
  Leaf,
  Pill,
  Handshake,
  Truck,
  MessageSquare,
} from "lucide-react";

import { getCategories } from "../../api/catalog";
import { getProducts } from "../../api/products";
import { getBlogs } from "../../api/blogs";

import './Home.css'

/**
 * Editorial dressing for the category cards — artwork and copy that has no column
 * in the database. Keyed by the category name the admin panel stores, so the list
 * itself still comes from the API; anything unrecognised falls back to the generic
 * icon and blurb below.
 */
const CATEGORY_PRESENTATION = {
  "Anti-Cancer": {
    icon: <Dna size={24} className="text-brand-700" />,
    desc: "Sourcing and supply of life-saving anti-cancer oncology formulations worldwide.",
    image: "/anti-cancer-med.webp",
  },
  "Anti Viral": {
    icon: <Syringe size={24} className="text-brand-700" />,
    desc: "High-quality direct-acting antiviral treatments for hepatitis and viral care.",
    image: "/HIV1.webp",
  },
  "Anti HIV": {
    icon: <HeartPulse size={24} className="text-brand-700" />,
    desc: "Supplying WHO-essential antiretroviral therapy and regimens globally.",
    image: "/HIV1.webp",
  },
  "Anti Diabetic": {
    icon: <Activity size={24} className="text-brand-700" />,
    desc: "Complete diabetes management range, from oral therapy to insulin analogues.",
    image: "/diabe.avif",
  },
  Vaccines: {
    icon: <ShieldCheck size={24} className="text-brand-700" />,
    desc: "Cold-chain validated vaccines for immunisation programmes and institutions.",
  },
  Antibiotic: {
    icon: <Syringe size={24} className="text-brand-700" />,
    desc: "Broad and narrow spectrum antibiotics for critical and community care.",
  },
  "Erectile Dysfunction": {
    icon: <Sparkles size={24} className="text-brand-700" />,
    desc: "Quality formulations for reproductive health and erectile dysfunction solutions.",
    image: "/erectile-dysfunction.webp",
  },
  "Nasal Spray": {
    icon: <Wind size={24} className="text-brand-700" />,
    desc: "Decongestants and steroid sprays for allergic and chronic nasal conditions.",
  },
  "Tablets & Capsules": {
    icon: <Pill size={24} className="text-brand-700" />,
    desc: "Everyday oral solids across our essential and specialty generic range.",
  },
  "Skin Care": {
    icon: <Heart size={24} className="text-brand-700" />,
    desc: "Dermatological therapy for chronic skin conditions and everyday wellness.",
  },
  "Ayurvedic Medicines": {
    icon: <Leaf size={24} className="text-brand-700" />,
    desc: "Premium natural herbal medicines for holistic health and wellness.",
  },
};

const DEFAULT_PRESENTATION = {
  icon: <Pill size={24} className="text-brand-700" />,
  desc: "Explore our verified, WHO-GMP sourced range in this therapeutic category.",
};

const presentationFor = (name) => CATEGORY_PRESENTATION[name] || DEFAULT_PRESENTATION;

/** Everything the hero and category cards link to is a filtered shop view. */
const shopLink = (category) => `/shop?category=${encodeURIComponent(category)}`;

const ABOUT_FEATURE_ICONS = {
  "Trusted Partner with Global Brands": <Handshake size={20} className="text-brand-700" />,
  "Fast & Reliable Delivery": <Truck size={20} className="text-brand-700" />,
  "Personalized Customer Support": <MessageSquare size={20} className="text-brand-700" />,
};

const BRAND_LOGOS = [
  { name: "Anthem BioPharma", src: "/anthem-biopharma.webp" },
  { name: "Arechar", src: "/arechar.webp" },
  { name: "Aristo", src: "/aristo.webp" },
  { name: "Astellas", src: "/astellas.webp" },
  { name: "Aubade", src: "/aubade.webp" },
  { name: "Aurobindo", src: "/aurobindo.webp" },
  { name: "Roche", src: "/roche.webp" },
];

const ABOUT_FEATURES = [
  {
    icon: "🤝",
    title: "Trusted Partner with Global Brands",
    desc: "Direct relationships with certified generic manufacturers and oncology lines.",
  },
  {
    icon: "🚚",
    title: "Fast & Reliable Delivery",
    desc: "Continuous cold chain packaging ensuring drug efficacy during transit.",
  },
  {
    icon: "💬",
    title: "Personalized Customer Support",
    desc: "Dedicated support officers offering custom regulatory clearance assistance.",
  },
];

/** Products listed per category tab in the Quick Medicine Enquiry panel. */
const ENQUIRY_PAGE_SIZE = 6;

const Home = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    let active = true;

    getCategories().then((list) => {
      if (!active) return;
      setCategories(list);
      setActiveTab((current) => current || list[0] || "");
    });

    getProducts()
      .then((list) => active && setProducts(list))
      .catch(() => {});

    getBlogs()
      .then((list) => active && setArticles(list.slice(0, 3)))
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const [featured, ...restCategories] = categories;

  const tabProducts = useMemo(
    () =>
      products
        .filter((p) => p.categoryLabel === activeTab)
        .slice(0, ENQUIRY_PAGE_SIZE),
    [products, activeTab],
  );

  return (
    <main className="bg-[#fff8f1]">

      {/* ================= HERO ================= */}
      <section className="hero-banner-section">
        <div className="hero-banner-grid">

          <div
            className="hero-card hero-card-large hover-trigger"
            style={{ backgroundImage: `url('/HIV1.webp')` }}
          >
            <div className="hero-card-overlay" />
            <div className="hero-card-content">
              <h2><WaveText text="Global HIV Treatment Solutions" /></h2>
              <p>Efavirenz, Tenofovir, Dolutegravir & more ARVs. Fast international shipping with full documentation support.</p>
              <button onClick={() => navigate(shopLink("Anti HIV"))} className="hero-card-btn hero-btn-yellow">
                View Details
              </button>
            </div>
          </div>

          <div
            className="hero-card hero-card-medium hover-trigger"
            style={{ backgroundImage: `url('/oncology.avif')` }}
          >
            <div className="hero-card-overlay" />
            <div className="hero-card-content">
              <h2><WaveText text="Oncology Medicines For Global Healthcare" /></h2>
              <p>Paclitaxel, Imatinib, and targeted cancer therapies. WHO-GMP certified for hospitals and distributors worldwide.</p>
              <button onClick={() => navigate(shopLink("Anti-Cancer"))} className="hero-card-btn hero-btn-dark">
                Shop Now
              </button>
            </div>
          </div>

          <div className="hero-card-right-col">
            <div
              className="hero-card hero-card-small hover-trigger"
              style={{ backgroundImage: `url('/diabe.avif')` }}
            >
              <div className="hero-card-overlay hero-card-overlay-light" />
              <div className="hero-card-content hero-card-content-light">
                <h3><WaveText text="Global Diabetes Treatment Solutions" /></h3>
                <p>Fast international shipping with full documentation support.</p>
                <button onClick={() => navigate(shopLink("Anti Diabetic"))} className="hero-card-link">
                  Shop Now →
                </button>
              </div>
            </div>

            <div
              className="hero-card hero-card-small hover-trigger"
              style={{ backgroundImage: `url('/erectile-dysfunction.webp')` }}
            >
              <div className="hero-card-overlay hero-card-overlay-light" />
              <div className="hero-card-content">
                <h3><WaveText text="Global ED Treatment Solutions" /></h3>
                <p>Reliable supply of PDE5 inhibitors for institutional buyers worldwide. Export documentation and discreet packaging included.</p>
                <button onClick={() => navigate(shopLink("Erectile Dysfunction"))} className="hero-card-link">
                  Shop Now →
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= BROWSE SPECIALIZED CATEGORIES ================= */}
      <section className="categories-section">
        <div className="categories-header hover-trigger">
          <h2>Browse Specialized Categories</h2>
          <p>
            We offer a complete range of therapeutics for complex health conditions,
            ensuring authenticity and global access.
          </p>
        </div>

        {featured && (
          <div className="categories-top-row">
            {/* Large card with image */}
            <div
              className="category-card category-card-large hover-trigger"
              onClick={() => navigate(shopLink(featured))}
            >
              <div className="category-card-text">
                <span className="category-chip">SPECIALTY</span>
                <h3><WaveText text={featured} /></h3>
                <p>{presentationFor(featured).desc}</p>
                <span className="category-link">View Medicine Range →</span>
              </div>
              {presentationFor(featured).image && (
                <div
                  className="category-card-image"
                  style={{ backgroundImage: `url('${presentationFor(featured).image}')` }}
                />
              )}
            </div>

            {/* Small card */}
            {restCategories[0] && (
              <div
                className="category-card category-card-plain hover-trigger"
                onClick={() => navigate(shopLink(restCategories[0]))}
              >
                <div className="category-icon">{presentationFor(restCategories[0]).icon}</div>
                <h3><WaveText text={restCategories[0]} /></h3>
                <p>{presentationFor(restCategories[0]).desc}</p>
                <span className="category-link">Learn More →</span>
              </div>
            )}
          </div>
        )}

        <div className="categories-grid">
          {restCategories.slice(1).map((category) => (
            <div
              key={category}
              className="category-card category-card-plain hover-trigger"
              onClick={() => navigate(shopLink(category))}
            >
              <div className="category-icon">{presentationFor(category).icon}</div>
              <h3><WaveText text={category} /></h3>
              <p>{presentationFor(category).desc}</p>
              <span className="category-link">Learn More →</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= QUICK MEDICINE ENQUIRY ================= */}
      <section className="enquiry-section">
        <div className="enquiry-heading-wrap">
          <span className="enquiry-heading">QUICK MEDICINE ENQUIRY</span>
        </div>

        <div className="enquiry-tabs">
          {categories.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`enquiry-tab ${activeTab === tab ? "enquiry-tab-active" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="enquiry-body">
          <div className="enquiry-list">
            {tabProducts.length === 0 ? (
              <p className="products-status">
                No products listed under {activeTab || "this category"} yet.
              </p>
            ) : (
              tabProducts.map((item) => (
                <div key={item.id} className="enquiry-item">
                  <div>
                    <span className="enquiry-item-chip">{item.categoryLabel}</span>
                    <h4>{item.name}</h4>
                    {item.genericName && (
                      <p className="enquiry-item-generic">{item.genericName}</p>
                    )}
                    <p className="enquiry-item-strength">
                      <strong>Strength:</strong> {item.strength || "—"}
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <strong>Pack:</strong> {item.packSize || "—"}
                    </p>
                  </div>
                  <button
                    className="enquiry-item-btn"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    Inquire Sourcing
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="enquiry-preview-panel">
            <div className="enquiry-preview-icon">?</div>
            <h4>Interactive Formulary Reader</h4>
            <p>
              Select any specialized drug from the left panel to preview cold-chain
              requirements, active compound formulas, and formulation details.
            </p>
          </div>
        </div>
      </section>

      {/* ================= AYURVEDIC MEDICINES BANNER ================= */}
      <section className="ayurvedic-section">
        <div className="ayurvedic-box">
          <div className="ayurvedic-content">
            <span className="ayurvedic-chip">A GLOBAL ONLINE PLATFORM FOR BEST AYURVEDIC MEDICINES</span>
            <h2>Ayurvedic Medicines</h2>
            <p>Embracing holistic health and wellness with premium natural herbal medicines.</p>
          </div>
          <button onClick={() => navigate(shopLink("Ayurvedic Medicines"))} className="ayurvedic-btn">
            View Medicine Range →
          </button>
        </div>
      </section>

      {/* ================= BRAND LOGOS ================= */}
      <section className="brands-section">
        <span className="brands-chip">COMPREHENSIVE GLOBAL ACCESS</span>
        <h2>Unnati Medicos Offers A Global Range of Medicines</h2>
        <p>Access to more than 100+ leading brands and marketed preparations, available across the globe.</p>

        <div className="brands-track-container">
          <div className="brands-track">
            {[...BRAND_LOGOS, ...BRAND_LOGOS].map((brand, idx) => (
              <div key={`${brand.name}-${idx}`} className="brand-logo-card">
                <img src={brand.src} alt={brand.name} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LATEST HEALTH INSIGHTS ================= */}
      {articles.length > 0 && (
        <section className="insights-section">
          <div className="insights-header">
            <div>
              <h2><WaveText text="Latest Health Insights" /></h2>
              <p>Authoritative pharmaceutical guidelines, pathology guides, and preventive healthcare articles.</p>
            </div>
            <button onClick={() => navigate("/latest-news")} className="insights-view-all">
              View All Articles ↗
            </button>
          </div>

          <div className="insights-grid">
            {articles.map((article) => (
              <div
                key={article.id}
                className="insight-card"
                onClick={() => navigate("/latest-news")}
              >
                {article.image && (
                  <div
                    className="insight-card-image"
                    style={{ backgroundImage: `url('${article.image}')` }}
                  />
                )}
                <div className="insight-card-body">
                  <div className="insight-meta">
                    <span>🕐 {article.readTime}</span>
                    {article.date && <span>📅 {article.date}</span>}
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <div className="insight-footer">
                    <span>👤 OUR TEAM</span>
                    <span className="insight-read-link">Read Full Article ↗</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= ABOUT SECTION ================= */}
      <section className="about-section">
        <div className="about-grid">
          <div className="about-text">
            <span className="about-chip">TWO DECADES OF SOURCING CREDIBILITY</span>
            <h2><WaveText text="About Us" /></h2>
            <p>
              Founded in 2011, Unnati Pharmax began as a contract manufacturer. Today,
              we serve international distributors, government tenders, and humanitarian
              organizations across five continents.
            </p>
            <p>
              Fueled by a passion for global health equity, we have grown into a fully
              export-oriented enterprise with WHO-GMP compliance, state-of-the-art
              manufacturing facilities, and a team of industry experts.
            </p>

            <div className="about-features">
              {ABOUT_FEATURES.map((f) => (
                <div key={f.title} className="about-feature-row">
                  <div className="about-feature-icon">{ABOUT_FEATURE_ICONS[f.title]}</div>
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-image-wrap">
            <div
              className="about-image"
              style={{ backgroundImage: `url('/mission-visiob.png')` }}
            />
            <div className="about-badge">
              <span className="about-badge-icon"><ShieldCheck size={24} className="text-white" /></span>
              <div>
                <strong>WHO-GMP Sourced</strong>
                <p>100% Inspected Batches</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= GLOBAL REACH & PARTNERSHIPS ================= */}
      <section className="global-reach-section">
        <div className="global-reach-grid">
          <div className="global-reach-content">
            <span className="global-reach-chip">GLOBAL EXPORT OPERATIONS</span>
            <h2><WaveText text="International Reach & Partnerships" /></h2>
            <p className="global-reach-desc">
              100% export-oriented, delivering critical medicines to over 180 countries
              including the US, UK, LATAM, Africa, Southeast Asia, and the Middle East. We
              ensure a reliable supply to government tenders, leading hospitals, large NGOs,
              and commercial importers abroad.
            </p>

            <div className="global-reach-stats">
              <div className="global-reach-stat-item">
                <h3>180+</h3>
                <p>COUNTRIES SERVED</p>
              </div>
              <div className="global-reach-stat-item">
                <h3>24/7</h3>
                <p>SUPPORT ACCESS</p>
              </div>
            </div>

            <div className="global-reach-features">
              <div className="global-reach-feature-row">
                <span className="global-reach-feature-icon">🤝</span>
                <div>
                  <strong>Strategic Collaborations</strong>
                  <p>Cipla, Sun Pharma, Novartis, GSK, Dr. Reddy’s, Intas, Pfizer, and more</p>
                </div>
              </div>

              <div className="global-reach-feature-row">
                <span className="global-reach-feature-icon">❄️</span>
                <div>
                  <strong>Cold Chain Logistics</strong>
                  <p>Polyurethane Cold boxes with PCM sheets & continuous payload thermal logging</p>
                </div>
              </div>

              <div className="global-reach-feature-row">
                <span className="global-reach-feature-icon">🏛️</span>
                <div>
                  <strong>Customs Clearances</strong>
                  <p>Approved Delhi/Customs clearances with direct hospital handover warrants</p>
                </div>
              </div>

              <div className="global-reach-feature-row">
                <span className="global-reach-feature-icon">📦</span>
                <div>
                  <strong>Bulk & Specialty Range</strong>
                  <p>Leveraging India's manufacturing ecosystem for specialty generic medicines</p>
                </div>
              </div>
            </div>
          </div>

          <div className="global-reach-image-wrap">
            <img src="/global_reach_network.png" alt="Global Shipping Network Map" />
          </div>
        </div>
      </section>

    </main>
  );
};

export default Home;

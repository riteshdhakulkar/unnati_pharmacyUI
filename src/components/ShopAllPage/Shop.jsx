import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiSearch, FiChevronDown, FiAlertCircle, FiArrowRight, FiPackage, FiAlertTriangle } from "react-icons/fi";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import EnquiryPopup from "../common/EnquiryPopup.jsx";
import { getProducts } from "../../api/products";
import { getCategories, getManufacturers } from "../../api/catalog";
import "./Shop.css";

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "brand-asc", label: "Brand (A–Z)" },
  { value: "price-asc", label: "Price (low to high)" },
];

const ALL = "all";

/** Products added per click of "Load More". */
const PAGE_SIZE = 12;

/** Turns a list of names into `<select>` options with an "all" entry on top. */
function toOptions(names, allLabel) {
  return [{ value: ALL, label: allLabel }, ...names.map((n) => ({ value: n, label: n }))];
}

/** Unique, sorted, non-empty values of one field across the catalogue. */
function distinct(products, field) {
  return [...new Set(products.map((p) => p[field]).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable filter dropdown                                          */
/* ------------------------------------------------------------------ */

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="filter-field">
      <label className="filter-label">{label}</label>
      <div className="filter-select-wrap">
        <select
          className="filter-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <FiChevronDown className="filter-select-icon" aria-hidden="true" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Product card                                                      */
/* ------------------------------------------------------------------ */

function ProductCard({ product, onEnquire, onInspect }) {
  const handleCardClick = (e) => {
    // If the click is inside a button (like Enquire Now) but not the Inspect button itself,
    // let the button handle it.
    if (e.target.closest('.btn-primary')) {
      return;
    }
    onInspect(product);
  };

  return (
    <article className="product-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="product-card-image">
        {product.image ? (
          <img src={product.image} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-card-image-placeholder">
            <FiPackage aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="product-card-body">
        <div className="product-card-badges">
          {product.categoryLabel && (
            <span className="badge badge-category">{product.categoryLabel}</span>
          )}
          <span className="badge badge-verified">
            <HiOutlineShieldCheck aria-hidden="true" />
            Verified Supply
          </span>
        </div>

        <h3 className="product-card-name">{product.name}</h3>
        {product.genericName && <p className="product-card-generic">{product.genericName}</p>}
        {product.description && (
          <p className="product-card-description">{product.description}</p>
        )}

        <dl className="product-card-meta">
          {product.brandLabel && (
            <div className="product-card-meta-row">
              <dt>Specialty Brand</dt>
              <dd>{product.brandLabel}</dd>
            </div>
          )}
          {product.unitDosage && (
            <div className="product-card-meta-row">
              <dt>Unit Dosage</dt>
              <dd>{product.unitDosage}</dd>
            </div>
          )}
          {product.clinicalSource && (
            <div className="product-card-meta-row">
              <dt>Clinical Source</dt>
              <dd>{product.clinicalSource}</dd>
            </div>
          )}
          {product.price.label && (
            <div className="product-card-meta-row">
              <dt>Indicative Price</dt>
              <dd>{product.price.label}</dd>
            </div>
          )}
        </dl>

        {product.tempTracked && (
          <div className="badge badge-temp">
            <FiAlertCircle aria-hidden="true" />
            Temp Tracked: {product.tempTracked}
          </div>
        )}

        <div className="product-card-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              onEnquire(product);
            }}
          >
            Enquire Now
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={(e) => {
              e.stopPropagation();
              onInspect(product);
            }}
          >
            Inspect <FiArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Shop page                                                         */
/* ------------------------------------------------------------------ */

export default function Shop() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  // Filter option lists come from the same tables that drive the navbar, so a
  // category with no stock yet is still offered here.
  const [categoryNames, setCategoryNames] = useState([]);
  const [brandNames, setBrandNames] = useState([]);

  const [sortBy, setSortBy] = useState("name-asc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [enquiryProduct, setEnquiryProduct] = useState(null);

  // The navbar links here with ?category= / ?salt= / ?manufacturer= / ?search=,
  // so the URL is the single source of truth for what is being filtered.
  const category = searchParams.get("category") || ALL;
  const salt = searchParams.get("salt") || ALL;
  const brand = searchParams.get("manufacturer") || ALL;
  const dosageForm = searchParams.get("dosage") || ALL;
  const searchTerm = searchParams.get("search") || "";

  const setParam = useCallback(
    (key, value) => {
      const next = new URLSearchParams(searchParams);
      if (!value || value === ALL) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    let active = true;

    getProducts()
      .then((list) => {
        if (!active) return;
        setProducts(list);
        setStatus("ready");
      })
      .catch(() => active && setStatus("error"));

    getCategories().then((list) => active && setCategoryNames(list));
    getManufacturers().then((list) => active && setBrandNames(list));

    return () => {
      active = false;
    };
  }, []);

  // Any change of filter starts the list over from the first page.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category, salt, brand, dosageForm, searchTerm, sortBy]);

  const categoryOptions = useMemo(
    () =>
      toOptions(
        categoryNames.length ? categoryNames : distinct(products, "categoryLabel"),
        "All Categories",
      ),
    [categoryNames, products],
  );

  const brandOptions = useMemo(
    () =>
      toOptions(brandNames.length ? brandNames : distinct(products, "brandLabel"), "All Brands"),
    [brandNames, products],
  );

  const dosageOptions = useMemo(
    () => toOptions(distinct(products, "dosageForm"), "All Forms"),
    [products],
  );

  const saltOptions = useMemo(
    () => toOptions(distinct(products, "genericName"), "All Salts"),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const matchesText = (value) => (value || "").toLowerCase().includes(term);

    const results = products.filter((product) => {
      const matchesSearch =
        term.length === 0 ||
        matchesText(product.name) ||
        matchesText(product.genericName) ||
        matchesText(product.brandLabel) ||
        matchesText(product.clinicalSource) ||
        matchesText(product.categoryLabel);

      return (
        matchesSearch &&
        (category === ALL || product.categoryLabel === category) &&
        (brand === ALL || product.brandLabel === brand) &&
        (dosageForm === ALL || product.dosageForm === dosageForm) &&
        // Salt links from the navbar are a contains match, since a combination
        // product's salt reads "Sofosbuvir / Daclatasvir".
        (salt === ALL || (product.genericName || "").toLowerCase().includes(salt.toLowerCase()))
      );
    });

    return [...results].sort((a, b) => {
      switch (sortBy) {
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "brand-asc":
          return (a.brandLabel || "").localeCompare(b.brandLabel || "");
        case "price-asc":
          return (a.price.min ?? Infinity) - (b.price.min ?? Infinity);
        case "name-asc":
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [products, searchTerm, category, brand, dosageForm, salt, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleEnquire = (product) => setEnquiryProduct(product);
  const handleInspect = (product) => navigate(`/product/${product.id}`);

  return (
    <div className="shop-page">
      {/* ---------------------------------------------------------- */}
      {/* Hero                                                       */}
      {/* ---------------------------------------------------------- */}
      <section className="shop-hero">
        <div className="shop-hero-decoration shop-hero-decoration-a" aria-hidden="true" />
        <div className="shop-hero-decoration shop-hero-decoration-b" aria-hidden="true" />
        <div className="shop-hero-decoration shop-hero-decoration-c" aria-hidden="true" />

        <div className="shop-hero-inner">
          <span className="shop-hero-badge">Certified Clinical Sourcing Index</span>
          <h1 className="shop-hero-title">
            {category !== ALL ? category : "Specialty Medicine Catalog"}
          </h1>
          <p className="shop-hero-subtitle">
            Search, filter, and inspect specific cold-chain storage parameters, FDA
            biosimilar equivalents, and packing sizes for our full generic therapeutics
            formulary.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Search + filters                                            */}
      {/* ---------------------------------------------------------- */}
      <div className="shop-controls">
        <div className="shop-search">
          <FiSearch className="shop-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="shop-search-input"
            placeholder="Search by medicine name, composition, brand, or manufacturer..."
            value={searchTerm}
            onChange={(e) => setParam("search", e.target.value)}
          />
        </div>

        <div className="shop-filters">
          <FilterSelect
            label="Category"
            value={category}
            onChange={(v) => setParam("category", v)}
            options={categoryOptions}
          />
          <FilterSelect
            label="Brand / Manufacturer"
            value={brand}
            onChange={(v) => setParam("manufacturer", v)}
            options={brandOptions}
          />
          <FilterSelect
            label="Salt / Composition"
            value={salt}
            onChange={(v) => setParam("salt", v)}
            options={saltOptions}
          />
          <FilterSelect
            label="Dosage Form"
            value={dosageForm}
            onChange={(v) => setParam("dosage", v)}
            options={dosageOptions}
          />
          <FilterSelect
            label="Sort By"
            value={sortBy}
            onChange={setSortBy}
            options={SORT_OPTIONS}
          />
        </div>

        <div className="shop-counter">
          <FiPackage aria-hidden="true" />
          {status === "ready" ? (
            <>
              Showing <strong>{visibleProducts.length}</strong> of{" "}
              <strong>{filteredProducts.length}</strong> products
            </>
          ) : (
            "Loading catalog…"
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Product grid                                                */}
      {/* ---------------------------------------------------------- */}
      <div className="shop-grid-wrap">
        {status === "loading" ? (
          <div className="shop-empty">
            <FiPackage aria-hidden="true" />
            <p>Loading products…</p>
          </div>
        ) : status === "error" ? (
          <div className="shop-empty">
            <FiAlertTriangle aria-hidden="true" />
            <p>We could not load the catalog right now. Please try again shortly.</p>
          </div>
        ) : visibleProducts.length > 0 ? (
          <div className="shop-grid">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEnquire={handleEnquire}
                onInspect={handleInspect}
              />
            ))}
          </div>
        ) : (
          <div className="shop-empty">
            <FiPackage aria-hidden="true" />
            <p>No products match your current filters.</p>
          </div>
        )}
      </div>

      {hasMore && (
        <div className="shop-load-more-wrap">
          <button
            type="button"
            className="btn-load-more"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          >
            Load More
          </button>
        </div>
      )}

      <div className="shop-about-wrap">
        <div className="shop-about">
          <h2>All Products</h2>
          <p><strong>Largest online platform for affordable healthcare</strong></p>
          <p>Unnati Pharmax offers a wide variety of life saving therapeutics for the critical health conditions and the chronic life-long treatments.</p>
          <p><strong>Our strong portfolio constitutes-</strong></p>
          <p><strong>Anticancer drugs</strong> - A complete range of oncology care products.</p>
          <p>More then 450+ products ranging from chemotherapeutic agents to the advanced care therapeutics.</p>
          <p><strong>Antivirals</strong> - Potent Direct Acting Antivirals and the Anti-Retroviral Therapy and combination therapy drugs for effective viral suppression in HIV and Hepatitis.</p>
          <p><strong>Transplant medicines</strong> - we offer affordable range of immonusuppresents for the life-long post-transplant care.</p>
          <p><strong>Chronic Disease Care Treatments-</strong></p>
          <p><strong>Cardiovascular drugs</strong> - Ace-inhibitors, statins</p>
          <p><strong>Hypertension drugs</strong> - calcium channel blockers, Diuretics</p>
          <p><strong>Liver support and management</strong> - Hepakast, Mesalzer, Ocabest</p>
          <p><strong>Respiratory care treatments</strong> - Bronchodilators, antitussives, Nasal Decongestants</p>
          <p><strong>Online platform for the leading brands -</strong></p>
          <p>Partners with the Global Pharma Companies, we bring the leading brands, the authentic care and uncompromised Quality.</p>
          <p>Cipla, Adley, Ajanta, Pfizer.</p>
          <p><strong>Affordable range products -</strong></p>
          <p>Committed to affordable care, accessible to all us, we bring the affordable range in</p>
          <p>Oncology- Carbokast-150, Bleokey, Cytarzer</p>
          <p>Hepatitis B- Velakast, Sofokast, Ribasure</p>
          <p>Gastroenterology - Ocabest, Rifaxigem, Udikast</p>
          <p>Rheumatology- Tofamark, Hqkast</p>
          <p><strong>Why Unnati Pharmax?</strong></p>
          <ul>
            <li>Assured quality</li>
            <li>Authentic brands</li>
            <li>Original products</li>
            <li>Affordable range</li>
            <li>Generic products</li>
            <li>Timely delivery</li>
            <li>Intact cold chain supply</li>
          </ul>
        </div>

        <button
          type="button"
          className="disclaimer-accordion"
          onClick={() => setDisclaimerOpen((v) => !v)}
          aria-expanded={disclaimerOpen}
        >
          <span className="disclaimer-icon"><FiAlertTriangle aria-hidden="true" /></span>
          <span className="disclaimer-text">
            <strong>Important Medical Disclaimer &amp; Legal Notices</strong>
            <small>Click to read guidelines on generic drug exports, trademark rights, and patient adherence.</small>
          </span>
          <FiChevronDown className={`disclaimer-chevron ${disclaimerOpen ? "is-open" : ""}`} aria-hidden="true" />
        </button>
        {disclaimerOpen && (
          <div className="disclaimer-body">
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

      <EnquiryPopup
        open={!!enquiryProduct}
        onClose={() => setEnquiryProduct(null)}
        productName={enquiryProduct?.name || ""}
        category={enquiryProduct?.categoryLabel || ""}
      />
    </div>
  );
}

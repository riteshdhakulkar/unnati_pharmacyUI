import { useEffect, useMemo, useState } from "react";
import "./LatestNews.css";
import WaveText from "../common/WaveText";
import { getBlogs } from "../../api/blogs";

const DISCLAIMER_TEXT = [
  {
    heading: "MEDICAL DISCLAIMER:",
    paras: [
      "All content found on this Website, including text, images, audio, or other formats, was created for informational purposes only. Offerings for continuing education credits are clearly identified and the appropriate target audience is identified. The Content is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this Website.",
      "Unnati Pharma – Exporters of Generic Medicines. If you think you may have a medical emergency, call your doctor or go to the emergency department, or immediately. Unnati Pharma does not recommend or endorse any specific tests, physicians, products, procedures, opinions, or other information that may be mentioned on this site. Reliance on any information provided by Unnati Pharma, its employees, contracted writers, or medical professionals presenting content for publication is solely at your own risk.",
      "The Site may contain health- or medical-related materials or discussions regarding sensitive disease states. If you find these materials uncomfortable, you may not want to use our Site. The Site and its Content are provided on an \"as is\" basis. Links to educational content not created by Unnati Pharma are taken at your own risk. Unnati Pharma is not responsible for the claims of external websites and education companies.",
    ],
  },
  {
    heading: "GENERAL ADVISORY:",
    paras: [
      "We advise you to stick to medication routine (or medication adherence), i.e. to take medications as prescribed – the right dose, at the right time, in the right way and frequency. Not taking medicines as prescribed by a doctor or instructed by a pharmacist could lead to disease getting worse, hospitalization, even death.",
      "Products protected by valid patents are not offered for sale in countries where the sale of such products constitutes patent infringement. Any liability for patent infringement is at the buyer's risk.",
      "All Trademarks, Brands and Service marks that appear on this website belong to their respective owner.",
    ],
  },
];

const LatestNews = () => {
  const [query, setQuery] = useState("");
  const [disclaimerOpen, setDisclaimerOpen] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let active = true;

    getBlogs()
      .then((list) => {
        if (!active) return;
        setBlogs(list);
        setStatus("ready");
      })
      .catch(() => active && setStatus("error"));

    return () => {
      active = false;
    };
  }, []);

  const filteredBlogs = useMemo(() => {
    if (!query.trim()) return blogs;
    const q = query.toLowerCase();
    return blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q)
    );
  }, [query, blogs]);

  return (
    <main className="latestnews-page">

      {/* ================= HERO ================= */}
      <section className="ln-hero hover-trigger">
        <span className="ln-hero-chip">CLINICAL HEALTH REPOSITORY</span>
        <h1><WaveText text="Latest Medical & Sourcing Insights" /></h1>
        <p>
          Gain deep clinical understanding regarding treatment methodologies,
          specialized cargo transportation, and generic alternatives verified
          by leading practitioners.
        </p>

        <div className="ln-search-row">
          <div className="ln-search-box">
            <span className="ln-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Filter publications, dosing guides..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="ln-total-badge">
            <span className="ln-total-dot" />
            TOTAL BLOGS: {blogs.length}
          </div>
        </div>
      </section>

      {/* ================= BLOG GRID ================= */}
      <section className="ln-grid-section">
        {status === "loading" ? (
          <p className="ln-empty">Loading articles…</p>
        ) : status === "error" ? (
          <p className="ln-empty">We could not load the articles right now.</p>
        ) : filteredBlogs.length === 0 ? (
          <p className="ln-empty">
            {blogs.length === 0
              ? "No articles have been published yet."
              : "No articles matched your search."}
          </p>
        ) : (
          <div className="ln-grid">
            {filteredBlogs.map((blog) => (
              <div key={blog.id} className="ln-card">
                {blog.image && (
                  <div
                    className="ln-card-image"
                    style={{ backgroundImage: `url('${blog.image}')` }}
                  />
                )}
                <div className="ln-card-body">
                  <div className="ln-card-meta">
                    <span>🕐 {blog.readTime}</span>
                    {blog.date && <span>📅 {blog.date}</span>}
                  </div>
                  <h3>{blog.title}</h3>
                  <p>{blog.excerpt}</p>
                  <div className="ln-card-footer">
                    <span className="ln-card-author">👤 {blog.author}</span>
                    {blog.link && (
                      <a
                        href={blog.link}
                        className="ln-card-link"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Read Article ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= DISCLAIMER ACCORDION ================= */}
      <section className="ln-disclaimer-section">
        <div className="ln-disclaimer-box">
          <button
            className="ln-disclaimer-header"
            onClick={() => setDisclaimerOpen((v) => !v)}
          >
            <div className="ln-disclaimer-icon">!</div>
            <div className="ln-disclaimer-title">
              <h4>Important Medical Disclaimer &amp; Legal Notices</h4>
              <p>Click to read guidelines on generic drug exports, trademark rights, and patient adherence.</p>
            </div>
            <span className={`ln-disclaimer-arrow ${disclaimerOpen ? "open" : ""}`}>▲</span>
          </button>

          {disclaimerOpen && (
            <div className="ln-disclaimer-content">
              {DISCLAIMER_TEXT.map((block) => (
                <div key={block.heading}>
                  <h5>{block.heading}</h5>
                  {block.paras.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </main>
  );
};

export default LatestNews;
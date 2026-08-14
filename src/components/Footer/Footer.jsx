import { useEffect, useState } from "react";
import { ArrowUp, HelpCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../assets/unnati-logo.png";
import EnquiryPopup from "../common/EnquiryPopup";
import { getCategories } from "../../api/catalog";

/** How many categories go in the first footer column before spilling into the second. */
const PRIMARY_COLUMN_SIZE = 5;

const pages = [
  { label: "About Us", path: "/about" },
  { label: "Latest News", path: "/latest-news" },
  { label: "Shop", path: "/shop" },
];
// Same number the navbar dials; the prefilled text lands in the chat draft.
const WHATSAPP_LINK =
  "https://wa.me/918669251513?text=" +
  encodeURIComponent("Hi Unnati Pharmax, I'd like to enquire about a medicine.");

const contactPages = [
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Return & Refund Policy", path: "/return-refund" },
];

export default function Footer() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // Same source as the navbar menu, so the two never drift apart.
  useEffect(() => {
    let active = true;
    getCategories().then((list) => active && setCategories(list));
    return () => {
      active = false;
    };
  }, []);

  const primaryCategories = categories.slice(0, PRIMARY_COLUMN_SIZE);
  const secondaryCategories = categories.slice(PRIMARY_COLUMN_SIZE);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative w-full bg-ink-900 text-ink-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-5">

        {/* Brand column */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="mb-6">
            <img
              src={logo}
              alt="Unnati Pharmax"
              className="h-16 object-contain"
            />
          </div>

          <p className="mb-1 text-sm text-ink-400">WhatsApp us 24/7</p>
          <p className="mb-5 text-2xl font-bold text-white">+91 82650 41513</p>

          <p className="mb-3 text-[15px] leading-relaxed text-ink-300">
            Ground Floor, House No 307/4, Guru Vandana Apartment, Kakasaheb
            Cholkar Marg Lakadganj, Nagpur - 440008, Maharashtra, India
          </p>
          <a
            href="mailto:unnatipharmax@gmail.com"
            className="inline-flex items-center gap-1 text-[15px] font-medium text-white underline underline-offset-2 hover:text-brand-400 transition-colors"
          >
            unnatipharmax@gmail.com
          </a>
        </div>

        {/* Categories */}
        <div>
          <h4 className="mb-5 text-lg font-semibold text-brand-400">Categories</h4>
          <ul className="space-y-3.5">
            {primaryCategories.map((c) => (
              <li key={c}>
                <Link
                  to={`/shop?category=${encodeURIComponent(c)}`}
                  className="text-[15px] font-semibold text-white hover:text-brand-400 transition-colors"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Remaining categories */}
        {secondaryCategories.length > 0 && (
          <div>
            <h4 className="mb-5 text-lg font-semibold text-brand-400">More Categories</h4>
            <ul className="space-y-3.5">
              {secondaryCategories.map((c) => (
                <li key={c}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(c)}`}
                    className="text-[15px] font-semibold text-white hover:text-brand-400 transition-colors"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pages */}
        <div>
          <h4 className="mb-5 text-lg font-semibold text-brand-400">Pages</h4>
          <ul className="space-y-3.5">
            {pages.map((p) => (
              <li key={p.label}>
                <Link to={p.path} className="text-[15px] font-semibold text-white hover:text-brand-400 transition-colors">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="mb-5 text-lg font-semibold text-brand-400">Contact Us</h4>
          <ul className="space-y-3.5">
            {contactPages.map((p) => (
              <li key={p.label}>
                <Link to={p.path} className="text-[15px] font-semibold text-white hover:text-brand-400 transition-colors">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm sm:flex-row">
          <p className="text-ink-400">Copyright &copy; 2025 Unnati Pharmax</p>
          <p className="text-center text-ink-300 sm:text-right">
            We Are A Trusted Global Supplier, IndiaMART Verified Exporter
            (4.7★), And A Licensed Indian Pharmacy (MH-NG2-******).
          </p>
        </div>
      </div>

      {/* Floating action buttons */}
      <div className="fixed bottom-24 right-6 z-30 flex flex-col gap-3">
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with us on WhatsApp"
          title="WhatsApp Chat"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:bg-[#1eba59]"
        >
          <FaWhatsapp size={24} />
        </a>
        <button
          type="button"
          onClick={() => setEnquiryOpen(true)}
          aria-label="Open medicine enquiry form"
          title="Medicine Enquiry"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-ink-900 shadow-lg transition hover:scale-105 hover:bg-brand-400 cursor-pointer"
        >
          <HelpCircle size={20} />
        </button>
        <button
          aria-label="Scroll to top"
          onClick={scrollToTop}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-ink-900 shadow-lg transition hover:scale-105 hover:bg-brand-400 cursor-pointer"
        >
          <ArrowUp size={20} />
        </button>
      </div>

      {/* Bottom brand stripe */}
      <div className="h-2 w-full bg-brand-500" />

      {/* Medicine enquiry modal — no productName, so the drug field is editable */}
      <EnquiryPopup open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </footer>
  );
}

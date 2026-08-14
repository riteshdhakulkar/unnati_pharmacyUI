import { useState, useRef, useEffect, useMemo } from "react";
import { FaShoppingCart, FaSearch, FaTimes, FaBars, FaHome, FaUser, FaListUl, FaUserPlus, FaRss, FaMobileAlt, FaUserMd } from "react-icons/fa";
import { ChevronDown, PhoneCall } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import {
  getBrowseTaxonomy,
  FALLBACK_CATEGORIES,
  FALLBACK_SALTS,
  FALLBACK_MANUFACTURERS,
} from "../../api/catalog";
import { getProducts } from "../../api/products";
import logo from "../../assets/unnati-logo.png";

// The menu is driven by the database (see CatalogDataInitializer on the backend).
// These are only what renders while that request is in flight, or if it fails.
const INITIAL_TAXONOMY = {
  categories: FALLBACK_CATEGORIES,
  salts: FALLBACK_SALTS,
  manufacturers: FALLBACK_MANUFACTURERS,
};

// Site sections always offered by the search box, ahead of any product matches.
const STATIC_PAGES = [
  { label: "Home", path: "/", type: "Page" },
  { label: "About Us", path: "/about", type: "Page" },
  { label: "Shop", path: "/shop", type: "Page" },
  { label: "Latest News", path: "/latest-news", type: "Page" },
  { label: "Contact Us", path: "/contact", type: "Page" },
];

// Which top-level nav item owns the current URL. Categories and Salt &
// Manufacturer both land on /shop, so they are told apart by query param.
function resolveActiveSection(pathname, search) {
  if (pathname === "/") return "home";
  if (["/about", "/privacy-policy", "/return-refund"].includes(pathname)) return "about";
  if (pathname.startsWith("/latest-news")) return "blog";
  if (pathname.startsWith("/contact")) return "contact";
  if (pathname.startsWith("/shop")) {
    const params = new URLSearchParams(search);
    if (params.has("salt") || params.has("manufacturer")) return "saltMfg";
    return "categories";
  }
  return null;
}

export default function Navbar() {


  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { count: cartCount } = useCart();
  const activeSection = resolveActiveSection(pathname, search);

  // A dropdown child is current only when its own path/param matches.
  const isCurrentPath = (path) => pathname === path;
  const isCurrentParam = (key, value) =>
    pathname.startsWith("/shop") && new URLSearchParams(search).get(key) === value;
  const [searchOpen, setSearchOpen] = useState(false);

  // Menu contents, loaded from the backend on mount.
  const [taxonomy, setTaxonomy] = useState(INITIAL_TAXONOMY);
  const { categories, salts, manufacturers } = taxonomy;

  // Live catalogue, so the search box suggests real products instead of a fixed list.
  const [productIndex, setProductIndex] = useState([]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState({
    about: false,
    categories: false,
    saltMfg: false,
    consultation: false,
    contact: false,
  });
  
  const searchContainerRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileInputRef = useRef(null);
  const bottomRowRef = useRef(null);
  const timeoutRef = useRef(null);


  const handleMouseEnter = (menuName) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(menuName);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150); // 150ms buffer
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Load the menu taxonomy and the product search index once.
  useEffect(() => {
    let active = true;

    getBrowseTaxonomy().then((data) => {
      if (active) setTaxonomy(data);
    });

    getProducts()
      .then((list) => {
        if (!active) return;
        setProductIndex(
          list.map((p) => ({
            label: p.name,
            // Salt and brand are searchable but not shown, so "Cipla" finds its products.
            haystack: [p.name, p.genericName, p.brandLabel, p.categoryLabel]
              .filter(Boolean)
              .join(" ")
              .toLowerCase(),
            path: `/product/${p.id}`,
            type: "Product",
          })),
        );
      })
      .catch(() => {
        // Search still offers the site pages if the catalogue is unreachable.
      });

    return () => {
      active = false;
    };
  }, []);

  const searchIndex = useMemo(() => [...STATIC_PAGES, ...productIndex], [productIndex]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchIndex
      .filter((item) => (item.haystack || item.label.toLowerCase()).includes(q))
      .slice(0, 8);
  }, [query, searchIndex]);

  // Focus the input when the mobile search opens.
  useEffect(() => {
    if (searchOpen) mobileInputRef.current?.focus();
  }, [searchOpen]);

  // Reset the highlighted result whenever the list changes.
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Close dropdowns on outside click.
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (bottomRowRef.current && !bottomRowRef.current.contains(e.target)) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function openSearch() {
    setMenuOpen(false);
    setSearchOpen((o) => !o);
  }

  function openMenu() {
    setSearchOpen(false);
    setMenuOpen((o) => !o);
  }

  function closeMobileSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  function goTo(path) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    navigate(path);
    closeMobileSearch();
    setIsFocused(false);
    setMenuOpen(false);
    setActiveDropdown(null);
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      setIsFocused(false);
      closeMobileSearch();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = results[activeIndex];
      if (target) {
        goTo(target.path);
      } else if (query.trim()) {
        goTo(`/shop?search=${encodeURIComponent(query)}`);
      }
    }
  }

  // Every top-level item carries a transparent underline so the active one
  // colouring in does not shift the row.
  const navItem = (active) =>
    `flex items-center gap-1.5 py-2 border-b-2 text-[15px] font-bold transition-colors ${
      active
        ? "border-brand-500 text-brand-700"
        : "border-transparent text-ink-900 hover:text-brand-700"
    }`;

  const dropdownItem = (active) =>
    `block px-4 py-2.5 text-sm font-semibold transition-colors ${
      active
        ? "bg-brand-50 text-brand-700"
        : "text-ink-700 hover:bg-brand-50 hover:text-brand-700"
    }`;

  const mobileItem = (active) =>
    `flex items-center gap-3 px-6 py-3.5 border-l-4 text-[15px] font-bold border-b border-b-ink-100 transition-colors ${
      active
        ? "border-l-brand-500 bg-brand-50 text-brand-700"
        : "border-l-transparent text-ink-900 hover:bg-ink-50"
    }`;

  const mobileToggle = (active) =>
    `w-full flex items-center justify-between px-6 py-3.5 border-l-4 text-[15px] font-bold border-b border-b-ink-100 transition-colors cursor-pointer ${
      active
        ? "border-l-brand-500 bg-brand-50 text-brand-700"
        : "border-l-transparent text-ink-900 hover:bg-ink-50"
    }`;

  const mobileSubItem = (active) =>
    `block py-2.5 text-[14px] font-semibold transition-colors ${
      active ? "text-brand-700" : "text-ink-700 hover:text-brand-700"
    }`;

  const SearchResultsDropdown = () => {
    if (!query.trim() || results.length === 0) return null;
    return (
      <div className="absolute left-0 top-full mt-1 w-full bg-white border border-ink-200 rounded-lg shadow-xl z-50 overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {results.map((item, index) => (
            <li key={`${item.type}-${item.path}-${item.label}`}>
              <button
                type="button"
                onClick={() => goTo(item.path)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm sm:text-base transition-colors cursor-pointer ${
                  index === activeIndex
                    ? "bg-brand-50 text-brand-800"
                    : "text-black hover:bg-ink-50"
                }`}
              >
                <span className="font-medium">{item.label}</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                  {item.type}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <header className="w-full relative z-50">
      {/* Top Row: White Background */}
      <div className="bg-white border-b border-ink-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:py-6">
          
          {/* Logo */}
          <Link to="/" className="w-40 md:w-48 flex-shrink-0" onClick={() => setMenuOpen(false)}>
            <img
              src={logo}
              alt="Unnati Pharmax"
              className="h-10 md:h-12 lg:h-14 object-contain"
            />
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8 relative" ref={searchContainerRef}>
            <div className="flex w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsFocused(true);
                }}
                onFocus={() => setIsFocused(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search"
                className="w-full border border-ink-300 border-r-0 rounded-l-md px-4 py-2.5 outline-none focus:border-brand-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => {
                  if (query.trim()) goTo(`/shop?search=${encodeURIComponent(query)}`);
                }}
                className="bg-brand-500 hover:bg-brand-400 transition-colors px-5 rounded-r-md text-ink-900 flex items-center justify-center cursor-pointer"
              >
                <FaSearch />
              </button>
            </div>
            
            {/* Desktop Search Results */}
            {isFocused && <SearchResultsDropdown />}
          </div>

          {/* Contact Box & Right Icons */}
          <div className="flex items-center gap-4 lg:gap-6">
            
            {/* Contact Box (Desktop only) */}
            <div className="hidden lg:flex items-center gap-3 border border-ink-200 rounded-lg p-2.5 px-4">
              <div className="text-brand-600">
                <PhoneCall size={28} strokeWidth={1.5} />
              </div>
              <div className="text-sm leading-tight">
                <div className="text-ink-500">Need help? WA us:</div>
                <div className="font-bold text-ink-900 text-base">+91 866 925 1513</div>
              </div>
            </div>

            {/* Mobile Search Toggle */}
            <button
              type="button"
              aria-label="Search"
              aria-expanded={searchOpen}
              onClick={openSearch}
              className="md:hidden flex items-center text-xl text-ink-800 hover:text-brand-700 transition-colors cursor-pointer"
            >
              <FaSearch />
            </button>

            {/* Cart (Mobile & Desktop) */}
            <Link
              to="/cart"
              aria-label="Cart"
              onClick={() => setMenuOpen(false)}
              className="relative text-xl text-ink-800 hover:text-brand-700 transition-colors"
            >
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-xs font-bold text-ink-900">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger */}
            <button
              type="button"
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={openMenu}
              className="lg:hidden flex items-center text-2xl cursor-pointer"
            >
              {menuOpen ? (
                <FaTimes className="hover:text-brand-700 duration-300" />
              ) : (
                <FaBars className="hover:text-brand-700 duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: White Background with visual border and new navigation links */}
      <div className="bg-white border-b border-ink-200 relative hidden lg:block" ref={bottomRowRef}>
        <div className="mx-auto max-w-7xl px-6 relative flex items-center justify-center gap-6 py-3">

          <nav className="flex items-center justify-center gap-7 flex-wrap">
            {/* Home */}
            <Link
              to="/"
              aria-current={activeSection === "home" ? "page" : undefined}
              className={navItem(activeSection === "home")}
            >
              <FaHome className={activeSection === "home" ? "text-brand-600" : "text-ink-800"} />
              <span>Home</span>
            </Link>

            {/* About */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("about")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "about" ? null : "about")}
                aria-current={activeSection === "about" ? "page" : undefined}
                className={`${navItem(activeSection === "about")} cursor-pointer`}
              >
                <FaUser className={activeSection === "about" ? "text-brand-600" : "text-ink-800"} />
                <span>About</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === "about" ? "rotate-180" : ""}`} />
              </button>
              
              {activeDropdown === "about" && (
                <div
                  onMouseEnter={() => handleMouseEnter("about")}
                  onMouseLeave={handleMouseLeave}
                  className="absolute left-0 top-full z-50 pt-2 w-48 animate-in fade-in slide-in-from-top-1 duration-200"
                >
                  <div className="rounded-lg bg-white py-2 shadow-xl border border-ink-100">
                    <Link
                      to="/about"
                      onClick={() => setActiveDropdown(null)}
                      className={dropdownItem(isCurrentPath("/about"))}
                    >
                      About Us
                    </Link>
                    <Link
                      to="/privacy-policy"
                      onClick={() => setActiveDropdown(null)}
                      className={dropdownItem(isCurrentPath("/privacy-policy"))}
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      to="/return-refund"
                      onClick={() => setActiveDropdown(null)}
                      className={dropdownItem(isCurrentPath("/return-refund"))}
                    >
                      Return & Refund Policy
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Categories */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("categories")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "categories" ? null : "categories")}
                aria-current={activeSection === "categories" ? "page" : undefined}
                className={`${navItem(activeSection === "categories")} cursor-pointer`}
              >
                <FaListUl className={activeSection === "categories" ? "text-brand-600" : "text-ink-800"} />
                <span>Categories</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === "categories" ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === "categories" && (
                <div
                  onMouseEnter={() => handleMouseEnter("categories")}
                  onMouseLeave={handleMouseLeave}
                  className="absolute left-0 top-full z-50 pt-2 w-56 animate-in fade-in slide-in-from-top-1 duration-200"
                >
                  <div className="rounded-lg bg-white py-2 shadow-xl border border-ink-100">
                    {categories.map((c) => (
                      <Link
                        key={c}
                        to={`/shop?category=${encodeURIComponent(c)}`}
                        onClick={() => setActiveDropdown(null)}
                        className={dropdownItem(isCurrentParam("category", c))}
                      >
                        {c}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Salt & Manufacturer */}
            <div
              onMouseEnter={() => handleMouseEnter("saltMfg")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "saltMfg" ? null : "saltMfg")}
                aria-current={activeSection === "saltMfg" ? "page" : undefined}
                className={`flex items-center gap-1 py-2 border-b-2 text-[15px] font-bold text-brand-800 transition-colors cursor-pointer ${
                  activeSection === "saltMfg" ? "border-brand-500" : "border-transparent hover:text-brand-700"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-brand-500 text-ink-900 text-[11px] font-black mr-0.5 shrink-0">+</span>
                <span>Salt & Manufacturer</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === "saltMfg" ? "rotate-180" : ""}`} />
              </button>

              {/* Mega Menu Dropdown inside the wrapper to keep the hover zone intact, aligned to parent row via unpositioned wrapper */}
              {activeDropdown === "saltMfg" && (
                <div
                  onMouseEnter={() => handleMouseEnter("saltMfg")}
                  onMouseLeave={handleMouseLeave}
                  className="absolute left-6 right-6 top-full z-50 pt-2 animate-in fade-in slide-in-from-top-2 duration-300"
                >
                  <div className="bg-white border border-ink-200 shadow-2xl rounded-b-xl p-8 grid grid-cols-2 gap-10 border-t-4 border-brand-500">
                    {/* By Salt Section */}
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between border-b border-ink-200 pb-3 mb-4">
                        <h3 className="text-[17px] font-bold text-ink-900">By Salt</h3>
                        <Link
                          to="/shop"
                          onClick={() => setActiveDropdown(null)}
                          className="text-xs text-brand-800 hover:text-brand-800 font-semibold border border-brand-200 hover:bg-brand-50 rounded px-3 py-1.5 transition-colors"
                        >
                          View More
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-0.5">
                        {salts.map((salt) => (
                          <Link
                            key={salt}
                            to={`/shop?salt=${encodeURIComponent(salt)}`}
                            onClick={() => setActiveDropdown(null)}
                            className={`flex items-center py-2.5 text-[14px] border-b border-dashed border-ink-100 transition-colors font-semibold ${
                              isCurrentParam("salt", salt)
                                ? "text-brand-700"
                                : "text-ink-700 hover:text-brand-700"
                            }`}
                          >
                            <FaListUl className="text-ink-400 text-[10px] mr-2 shrink-0" />
                            <span className="truncate">{salt}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* By Manufacturer Section */}
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between border-b border-ink-200 pb-3 mb-4">
                        <h3 className="text-[17px] font-bold text-ink-900">By Manufacturer</h3>
                        <Link
                          to="/shop"
                          onClick={() => setActiveDropdown(null)}
                          className="text-xs text-brand-800 hover:text-brand-800 font-semibold border border-brand-200 hover:bg-brand-50 rounded px-3 py-1.5 transition-colors"
                        >
                          View More
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-0.5">
                        {manufacturers.map((mfg) => (
                          <Link
                            key={mfg}
                            to={`/shop?manufacturer=${encodeURIComponent(mfg)}`}
                            onClick={() => setActiveDropdown(null)}
                            className={`flex items-center py-2.5 text-[14px] border-b border-dashed border-ink-100 transition-colors font-semibold ${
                              isCurrentParam("manufacturer", mfg)
                                ? "text-brand-700"
                                : "text-ink-700 hover:text-brand-700"
                            }`}
                          >
                            <FaListUl className="text-ink-400 text-[10px] mr-2 shrink-0" />
                            <span className="truncate">{mfg}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          

     

            {/* Blog */}
            <Link
              to="/latest-news"
              aria-current={activeSection === "blog" ? "page" : undefined}
              className={navItem(activeSection === "blog")}
            >
              <FaRss className={activeSection === "blog" ? "text-brand-600" : "text-ink-800"} />
              <span>Blog</span>
            </Link>

            {/* Contact Us */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("contact")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "contact" ? null : "contact")}
                aria-current={activeSection === "contact" ? "page" : undefined}
                className={`${navItem(activeSection === "contact")} cursor-pointer`}
              >
                <FaMobileAlt className={activeSection === "contact" ? "text-brand-600" : "text-ink-800"} />
                <span>Contact Us</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === "contact" ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === "contact" && (
                <div
                  onMouseEnter={() => handleMouseEnter("contact")}
                  onMouseLeave={handleMouseLeave}
                  className="absolute left-0 top-full z-50 pt-2 w-48 animate-in fade-in slide-in-from-top-1 duration-200"
                >
                  <div className="rounded-lg bg-white py-2 shadow-xl border border-ink-100">
                    <Link
                      to="/contact"
                      onClick={() => setActiveDropdown(null)}
                      className={dropdownItem(isCurrentPath("/contact"))}
                    >
                      Contact Form
                    </Link>
                    <a
                      href="https://wa.me/918669251513"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setActiveDropdown(null)}
                      className={dropdownItem(false)}
                    >
                      WhatsApp Chat
                    </a>
                  </div>
                </div>
              )}
            </div>
          </nav>



        </div>
      </div>

      {/* Mobile Search Panel */}
      {searchOpen && (
        <div className="md:hidden absolute inset-x-0 top-full z-50 border-t border-ink-200 bg-white shadow-lg">
          <div ref={mobileSearchRef} className="px-6 py-6">
            <div className="relative">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                ref={mobileInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                className="w-full rounded-md border border-ink-300 bg-ink-50 py-3 pl-10 pr-12 text-base outline-none transition-colors focus:border-brand-500 focus:bg-white"
              />
              <button
                type="button"
                onClick={closeMobileSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-ink-400 hover:text-brand-700 cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="mt-2 relative">
              <SearchResultsDropdown />
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-[80px] md:top-[100px] z-40 bg-black/40" onClick={() => setMenuOpen(false)}>
          <nav
            className="bg-white border-t border-ink-100 shadow-lg max-h-[calc(100vh-8rem)] overflow-y-auto py-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Home */}
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              aria-current={activeSection === "home" ? "page" : undefined}
              className={mobileItem(activeSection === "home")}
            >
              <FaHome className={activeSection === "home" ? "text-brand-600" : "text-ink-500"} />
              Home
            </Link>

            {/* About (Dropdown) */}
            <div>
              <button
                onClick={() => setMobileExpanded(prev => ({ ...prev, about: !prev.about }))}
                aria-current={activeSection === "about" ? "page" : undefined}
                className={mobileToggle(activeSection === "about")}
              >
                <span className="flex items-center gap-3">
                  <FaUser className={activeSection === "about" ? "text-brand-600" : "text-ink-500"} />
                  About
                </span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${mobileExpanded.about ? "rotate-180" : ""}`} />
              </button>
              {mobileExpanded.about && (
                <div className="bg-ink-50/50 pl-12 border-b border-ink-100">
                  <Link to="/about" onClick={() => setMenuOpen(false)} className={mobileSubItem(isCurrentPath("/about"))}>About Us</Link>
                  <Link to="/privacy-policy" onClick={() => setMenuOpen(false)} className={mobileSubItem(isCurrentPath("/privacy-policy"))}>Privacy Policy</Link>
                  <Link to="/return-refund" onClick={() => setMenuOpen(false)} className={mobileSubItem(isCurrentPath("/return-refund"))}>Return & Refund Policy</Link>
                </div>
              )}
            </div>

            {/* Categories (Dropdown) */}
            <div>
              <button
                onClick={() => setMobileExpanded(prev => ({ ...prev, categories: !prev.categories }))}
                aria-current={activeSection === "categories" ? "page" : undefined}
                className={mobileToggle(activeSection === "categories")}
              >
                <span className="flex items-center gap-3">
                  <FaListUl className={activeSection === "categories" ? "text-brand-600" : "text-ink-500"} />
                  Categories
                </span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${mobileExpanded.categories ? "rotate-180" : ""}`} />
              </button>
              {mobileExpanded.categories && (
                <div className="bg-ink-50/50 pl-12 border-b border-ink-100 max-h-60 overflow-y-auto">
                  {categories.map(c => (
                    <Link
                      key={c}
                      to={`/shop?category=${encodeURIComponent(c)}`}
                      onClick={() => setMenuOpen(false)}
                      className={mobileSubItem(isCurrentParam("category", c))}
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Salt & Manufacturer (Dropdown) */}
            <div>
              <button
                onClick={() => setMobileExpanded(prev => ({ ...prev, saltMfg: !prev.saltMfg }))}
                aria-current={activeSection === "saltMfg" ? "page" : undefined}
                className={`w-full flex items-center justify-between px-6 py-3.5 border-l-4 text-[15px] font-bold text-brand-800 border-b border-b-ink-100 transition-colors cursor-pointer ${
                  activeSection === "saltMfg"
                    ? "border-l-brand-500 bg-brand-50"
                    : "border-l-transparent hover:bg-ink-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-brand-500 text-ink-900 text-[11px] font-black shrink-0">+</span>
                  Salt & Manufacturer
                </span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${mobileExpanded.saltMfg ? "rotate-180" : ""}`} />
              </button>
              {mobileExpanded.saltMfg && (
                <div className="bg-ink-50/50 pl-10 pr-6 border-b border-ink-100 max-h-[300px] overflow-y-auto py-2">
                  <div className="font-bold text-[13px] text-ink-400 uppercase tracking-wider mb-2">By Salt</div>
                  <div className="grid grid-cols-1 gap-1 mb-4 pl-2">
                    {salts.map(salt => (
                      <Link
                        key={salt}
                        to={`/shop?salt=${encodeURIComponent(salt)}`}
                        onClick={() => setMenuOpen(false)}
                        className={`block py-1.5 text-[14px] font-semibold transition-colors ${
                          isCurrentParam("salt", salt)
                            ? "text-brand-700"
                            : "text-ink-700 hover:text-brand-700"
                        }`}
                      >
                        • {salt}
                      </Link>
                    ))}
                  </div>
                  <div className="font-bold text-[13px] text-ink-400 uppercase tracking-wider mb-2">By Manufacturer</div>
                  <div className="grid grid-cols-1 gap-1 pl-2">
                    {manufacturers.map(mfg => (
                      <Link
                        key={mfg}
                        to={`/shop?manufacturer=${encodeURIComponent(mfg)}`}
                        onClick={() => setMenuOpen(false)}
                        className={`block py-1.5 text-[14px] font-semibold transition-colors ${
                          isCurrentParam("manufacturer", mfg)
                            ? "text-brand-700"
                            : "text-ink-700 hover:text-brand-700"
                        }`}
                      >
                        • {mfg}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Consultation (Dropdown) */}
            <div>
              <button
                onClick={() => setMobileExpanded(prev => ({ ...prev, consultation: !prev.consultation }))}
                className={mobileToggle(false)}
              >
                <span className="flex items-center gap-3">
                  <FaUserMd className="text-ink-500" />
                  Consultation
                </span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${mobileExpanded.consultation ? "rotate-180" : ""}`} />
              </button>
              {mobileExpanded.consultation && (
                <div className="bg-ink-50/50 pl-12 border-b border-ink-100">
                  <Link to="/contact" onClick={() => setMenuOpen(false)} className={mobileSubItem(false)}>Online Consultation</Link>
                  <Link to="/contact" onClick={() => setMenuOpen(false)} className={mobileSubItem(false)}>Book Appointment</Link>
                  <a href="https://wa.me/918669251513" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)} className={mobileSubItem(false)}>WhatsApp Consultation</a>
                </div>
              )}
            </div>

            {/* Generic */}
            <Link
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className={`${mobileItem(false)} gap-2`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-black text-white text-[11px] font-black shrink-0">+</span>
              Generic
            </Link>

            {/* Registration */}
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className={mobileItem(false)}
            >
              <FaUserPlus className="text-ink-500" />
              Registration
            </Link>

            {/* Blog */}
            <Link
              to="/latest-news"
              onClick={() => setMenuOpen(false)}
              aria-current={activeSection === "blog" ? "page" : undefined}
              className={mobileItem(activeSection === "blog")}
            >
              <FaRss className={activeSection === "blog" ? "text-brand-600" : "text-ink-500"} />
              Blog
            </Link>

            {/* Contact Us (Dropdown) */}
            <div>
              <button
                onClick={() => setMobileExpanded(prev => ({ ...prev, contact: !prev.contact }))}
                aria-current={activeSection === "contact" ? "page" : undefined}
                className={mobileToggle(activeSection === "contact")}
              >
                <span className="flex items-center gap-3">
                  <FaMobileAlt className={activeSection === "contact" ? "text-brand-600" : "text-ink-500"} />
                  Contact Us
                </span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${mobileExpanded.contact ? "rotate-180" : ""}`} />
              </button>
              {mobileExpanded.contact && (
                <div className="bg-ink-50/50 pl-12 border-b border-ink-100">
                  <Link to="/contact" onClick={() => setMenuOpen(false)} className={mobileSubItem(isCurrentPath("/contact"))}>Contact Form</Link>
                  <a href="https://wa.me/918669251513" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)} className={mobileSubItem(false)}>WhatsApp Chat</a>
                  <a href="mailto:info@unnatipharmax.com" onClick={() => setMenuOpen(false)} className={mobileSubItem(false)}>Email Us</a>
                </div>
              )}
            </div>


          </nav>
        </div>
      )}
    </header>
  );
}

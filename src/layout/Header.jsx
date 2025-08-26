import { useTranslation } from "react-i18next";
// import { useState } from "react"; // REMOVE THIS LINE
import { Link } from "react-router-dom";
import LanguageSwitcher from "../components/LanguageSwitcher";
import conatelLogo from "../assets/conatel-logo.png";
import coatOfArms from "../assets/coat-of-arms.png";
import './Header.css';

export default function Header() {
  const { t } = useTranslation();
  // Removed showMobileSearch and toggleMobileSearch from Header as they are moving to Navbar
  // const [showMobileSearch, setShowMobileSearch] = useState(false);
  // const toggleMobileSearch = () => {
  //   setShowMobileSearch(!showMobileSearch);
  // };

  const clickableStyle = { cursor: 'pointer' };

  return (
    <header
      style={{
        backgroundColor: "rgb(5, 40, 106)",
        color: "#fff",
        padding: "0.5rem 0",
      }}
    >
      <div className="container">

        {/* ========== Desktop View (No changes here, desktop search remains) ========== */}
        <div className="d-none d-md-flex align-items-center justify-content-between header-desktop-container">
          {/* Logo (Left) */}
          <div className="d-flex align-items-center header-logo-area">
            <Link to="/" className="d-flex align-items-center" style={clickableStyle}>
              <img
                src={conatelLogo}
                alt="CONATEL Logo"
                style={{ height: "160px", objectFit: "contain" }}
              />
            </Link>
          </div>

          {/* Title and Subtitle (Center) */}
          <div className="text-center flex-grow-1 header-title-area">
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                ...clickableStyle
              }}
            >
              {/* Changed 'display-6' to 'display-4' for a larger main title */}
              <h1 className="display-6 fw-bold m-0 text-white">CONATEL</h1>
              {/* Changed 'fs-5' to 'fs-3' for a larger subtitle */}
              <p className="m-0 fs-6">{t("header.subtitle")}</p>
            </Link>
          </div>

          {/* Right-side Group: Coat of Arms, Language Switcher, Search */}
          <div className="d-flex flex-column align-items-end header-right-group">
            <div className="d-flex align-items-end header-icons-row">
              {/* Coat of Arms (Desktop) */}
              <img
                src={coatOfArms}
                alt="Haiti Coat of Arms"
                className="coat-of-arms-desktop"
                style={{ height: "100px", padding: "0.5rem 1rem 0.2rem 0.9rem" }}
              />
              <div className="language-switcher-wrapper">
                {/* LanguageSwitcher remains here for Desktop */}
                <LanguageSwitcher size="extra-large" />
              </div>
            </div>

            <form className="search-form" role="search" action="/search" method="get">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  marginBottom: 1,
                  padding: "0.3rem 0.75rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  minWidth: "180px",
                }}
              >
                <input
                  type="search"
                  name="q"
                  placeholder={t("header.searchPlaceholder")}
                  aria-label={t("header.searchPlaceholder")}
                  style={{
                    border: "none",
                    outline: "none",
                    fontSize: "0.95rem",
                    flex: 1,
                    backgroundColor: "transparent",
                    color: "#000",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#333",
                    fontSize: "1.2rem",
                    paddingLeft: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ========== Mobile View (Removed Search Toggle and Input) ========== */}
        <div className="d-flex d-md-none align-items-center justify-content-between p-2 mobile-header-simplified">

          {/* Left Section: Logo */}
          <div className="mobile-header-left">
            <Link to="/" className="d-flex align-items-center" style={clickableStyle}>
              <img
                src={conatelLogo}
                alt="CONATEL Logo"
                style={{ height: "70px", objectFit: "contain" }}
              />
            </Link>
          </div>

          {/* Middle Section: Title and Subtitle (Centered within its space) */}
          <div className="text-center mobile-header-center flex-grow-1">
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                ...clickableStyle
              }}
            >
              <h1 className="fw-bold m-0 text-white fs-5">CONATEL</h1>
              <p className="m-0" style={{ fontSize: '0.7rem' }}>{t("header.subtitle")}</p>
            </Link>
          </div>

          {/* Right Section: Coat of Arms (Search toggle removed from here) */}
          <div className="mobile-header-right">
            <img src={coatOfArms} alt="Haiti Coat of Arms" style={{ height: "45px" }} />
          </div>
        </div>
      </div>
    </header>
  );
}
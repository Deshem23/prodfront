import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import './LanguageSwitcher.css';

export default function LanguageSwitcher({ size, isMobileVersion }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLanguageChange = (lang) => {
    // This is the key change: saving the language to localStorage
    i18n.changeLanguage(lang);
    localStorage.setItem("selectedLanguage", lang); 
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sizeClass = size ? `language-switcher-${size}` : '';
  const langTextColorClass = isMobileVersion ? 'lang-text-mobile-blue' : '';
  const currentLangCode = i18n.language.toUpperCase();

  return (
    <div
      className="language-switcher-container"
      ref={dropdownRef}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <button
        onClick={toggleDropdown}
        className={`language-switcher-toggle ${sizeClass}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Change Language"
      >
        <span className={langTextColorClass} style={{ marginRight: '5px', fontSize: '0.7rem' }}>
          {currentLangCode}
        </span>
        <i className="bi bi-globe globe-icon"></i>
      </button>

      {isOpen && (
        <div className="language-dropdown-menu">
          <button onClick={() => handleLanguageChange("fr")} className="language-option" title="Français">
            FR
          </button>
          <button onClick={() => handleLanguageChange("ht")} className="language-option" title="Kreyòl">
            HT
          </button>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";
import './LatestNewsCard.css';

const STRAPI_BASE_URL = "http://localhost:1337";
const STRAPI_API_URL = `${STRAPI_BASE_URL}/api`;

// Remove the onArticleClick prop as it's no longer needed
export default function LatestNewsCard() {
  const { t, i18n } = useTranslation('sidebar');
  const primaryColor = 'rgb(5, 40, 106)';
  
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${STRAPI_API_URL}/articles?locale=${i18n.language}&sort[0]=date:desc&pagination[limit]=3`);
        
        const fetchedNews = response.data.data.map(item => ({
          id: item.id,
          // Correct mapping for Strapi 5
          date: item.date ?? 'No Date',
          title: item.title ?? 'Untitled News',
        }));
        setNewsItems(fetchedNews);
      } catch (err) {
        setError("Failed to fetch latest news.");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [i18n.language]);

  const borderBottomStyle = {
    borderBottom: '1px solid red',
    paddingBottom: '10px'
  };

  return (
    <div
      className="glass-card latest-news-card d-flex flex-column"
      style={{ borderTop: `20px solid ${primaryColor}` }}
    >
      <div
        style={{
          color: primaryColor,
          padding: '10px 1rem',
          fontWeight: 'bold',
          fontSize: '1.25rem',
          ...borderBottomStyle
        }}
        className="d-flex align-items-center justify-content-between"
      >
        <span>{t('latestNewsCard.title')}</span>
        <i className="bi bi-newspaper fs-4"></i>
      </div>

      <div className="news-list-container flex-grow-1 p-4">
        {loading && <p>Loading news...</p>}
        {error && <p className="text-danger">{error}</p>}
        
        {!loading && !error && newsItems.length === 0 && (
          <p>No latest news found.</p>
        )}

        {!loading && !error && (
          <ul className="list-unstyled mb-0 news-list">
            {newsItems.map((item) => (
              <li key={item.id} className="mb-2">
                {/* Revert to the Link component to enable navigation */}
                <Link 
                  to={`/actualites?id=${item.id}`} 
                  style={{ textDecoration: 'none', color: primaryColor, display: 'block' }}
                >
                  <small className="text-muted d-block">{item.date}</small>
                  <p className="mb-0" style={{ fontWeight: 'bold' }}>{item.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 pt-0">
        <Link
          to="/actualites"
          className="btn btn-sm w-100"
          style={{ backgroundColor: primaryColor, color: '#fff' }}
        >
          {t('latestNewsCard.viewAll')}
        </Link>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// Use environment variable for API URL
const API_BASE = 'https://pretty-novelty-2b255ff22b.strapiapp.com';
const API_URL = `${API_BASE}/api`;

export default function Rapports() {
  const { t, i18n } = useTranslation(['rapports', 'sidebar']);
  const [rapportsData, setRapportsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Strapi
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔄 Fetching data...');
        
        // Rapports list
        const rapportsRes = await axios.get(`${API_URL}/rapports?populate=*&locale=${i18n.language}`);
        console.log('✅ Rapports received:', rapportsRes.data);
        
        const rapports = rapportsRes.data.data.map(r => ({
          id: r.id,
          title: r.title,
          description: r.description,
          date: r.date,
          pdf: r.pdf?.url || null
        }));
        
        setRapportsData(rapports);
        setLoading(false);
        
      } catch (err) {
        console.error("❌ API Error:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [i18n.language]);

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading rapports...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="container my-5" 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-center mb-3" style={{ color: 'rgb(5, 40, 106)' }}>
        Rapports
      </h2>

      <div className="row">
        <div className="col-12">
          <div className="bg-white rounded p-4 shadow-sm">
            <h4>Rapports List ({rapportsData.length})</h4>
            
            {rapportsData.length > 0 ? (
              <ul className="list-unstyled">
                {rapportsData.map(rapport => (
                  <li key={rapport.id} className="py-3 border-bottom">
                    <h5>{rapport.title}</h5>
                    <p>{rapport.description}</p>
                    <small className="text-muted">Date: {rapport.date}</small>
                    {rapport.pdf && (
                      <div className="mt-2">
                        <a 
                          href={rapport.pdf} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                        >
                          View PDF
                        </a>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="alert alert-info">
                No rapports found.
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'react-bootstrap';
import { FaEye, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const API_BASE = 'https://pretty-novelty-2b255ff22b.strapiapp.com';
const API_URL = `${API_BASE}/api`;

export default function Rapports() {
  const { t, i18n } = useTranslation(['rapports', 'sidebar']);
  const [search, setSearch] = useState('');
  const [selectedRapport, setSelectedRapport] = useState(null);
  const [rapportsData, setRapportsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rapportsRes = await axios.get(`${API_URL}/rapports?populate=*&locale=${i18n.language}`);
        
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
        console.error("API Error:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [i18n.language]);

  const filteredRapports = rapportsData.filter(rapport =>
    (rapport.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (rapport.description || '').toLowerCase().includes(search.toLowerCase()) ||
    (rapport.date || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (rapport) => setSelectedRapport(rapport);
  const handleCloseModal = () => setSelectedRapport(null);

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
    <motion.div className="container my-5" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h2 className="text-center mb-3" style={{ color: 'rgb(5, 40, 106)' }}>
        Rapports
      </h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search rapports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control w-100 mx-auto"
          style={{ maxWidth: '400px' }}
        />
      </div>

      <div className="row">
        <div className="col-12">
          <div className="bg-white rounded p-4 shadow-sm">
            <h4>Rapports List ({filteredRapports.length} of {rapportsData.length})</h4>
            
            {filteredRapports.length > 0 ? (
              <ul className="list-unstyled">
                {filteredRapports.map(rapport => (
                  <li key={rapport.id} className="py-3 border-bottom d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-file-earmark-bar-graph me-3 fs-4" style={{ color: 'rgb(5, 40, 106)' }}></i>
                      <div>
                        <h5 className="mb-1">{rapport.title}</h5>
                        <small className="text-muted">
                          <i className="bi bi-calendar-event me-1"></i>
                          {rapport.date}
                        </small>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleOpenModal(rapport)}
                      >
                        <FaEye className="me-1" />
                        View
                      </Button>
                      {rapport.pdf && (
                        <Button 
                          variant="primary" 
                          size="sm"
                          href={rapport.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaDownload className="me-1" />
                          PDF
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="alert alert-info text-center">
                {search ? 'No results found for your search.' : 'No rapports found.'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedRapport && (
          <motion.div 
            className="modal-overlay" 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div 
              className="modal-content"
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>{selectedRapport.title}</h3>
                <button onClick={handleCloseModal} className="btn-close"></button>
              </div>
              
              <p><strong>Date:</strong> {selectedRapport.date}</p>
              <p>{selectedRapport.description}</p>
              
              {selectedRapport.pdf && (
                <div className="mt-3">
                  <Button 
                    href={selectedRapport.pdf} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    variant="primary"
                  >
                    <FaDownload className="me-1" />
                    Download PDF
                  </Button>
                </div>
              )}
              
              <div className="mt-3">
                <Button onClick={handleCloseModal} variant="secondary">
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
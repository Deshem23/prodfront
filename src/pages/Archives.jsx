import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Button, Pagination } from "react-bootstrap";

import './Archives.css';

const STRAPI_BASE_URL = "http://localhost:1337";
const STRAPI_API_URL = `${STRAPI_BASE_URL}/api`;

const ITEMS_PER_PAGE = 7; // Set the number of items per page

export default function Archives() {
  const { t, i18n } = useTranslation(['archives']);
  const primaryColor = "rgb(5, 40, 106)";
  
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  const [modalShow, setModalShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // New state for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // New combined filter types
  const fileTypes = ["all", "pdf", "document", "excel", "ppt", "image"];

  // Function to handle programmatic download
  const handleDownloadClick = async (file) => {
    if (!file.fileUrl) {
      return;
    }
    try {
      const response = await axios.get(file.fileUrl, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.title + '.' + file.fileExt); 
      
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleViewClick = (file) => {
    if (file.fileExt === 'jpg' || file.fileExt === 'jpeg') {
        setSelectedFile(file);
        setModalShow(true);
    } else {
        window.open(file.fileUrl, '_blank');
    }
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${STRAPI_API_URL}/archives?locale=${i18n.language}&populate=*`
        );

        const fetchedFiles = response.data.data.map(item => {
          const fileData = item.attributes || item;

          const fileAttr =
            fileData.file?.data?.attributes || fileData.file || null;

          const filePath = fileAttr?.url || null;
          const fileExtension = fileAttr?.ext || ".file";

          return {
            id: item.id,
            title: fileData?.title ?? "Untitled",
            description: fileData?.description ?? "No description available.",
            date: fileData?.date ?? "No Date",
            fileUrl: filePath ? `${STRAPI_BASE_URL}${filePath}` : null,
            fileExt: fileExtension.substring(1).toLowerCase(),
          };
        });

        setFiles(fetchedFiles);
      } catch (err) {
        setError("Failed to fetch archives. Please check the API URL and permissions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [i18n.language]);

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const isDocumentFile = f.fileExt === 'doc' || f.fileExt === 'docx';
      const isExcelFile = f.fileExt === 'xlsx' || f.fileExt === 'xls';
      const isImageFile = f.fileExt === 'jpg' || f.fileExt === 'jpeg';

      const matchesType = selectedType === "all" || 
                          (selectedType === "document" && isDocumentFile) ||
                          (selectedType === "excel" && isExcelFile) ||
                          (selectedType === "image" && isImageFile) ||
                          (f.fileExt === selectedType); // Handles pdf and ppt

      const matchesSearch = f.title.toLowerCase().includes(search.toLowerCase()) ||
                            f.description.toLowerCase().includes(search.toLowerCase());
                            
      const matchesDate = !selectedDate || f.date.substring(0, 7) === selectedDate;

      return matchesType && matchesSearch && matchesDate;
    });
  }, [files, search, selectedType, selectedDate]);
  
  // Pagination Logic
  const totalPages = Math.ceil(filteredFiles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFiles = filteredFiles.slice(startIndex, endIndex);

  // New function to generate the dynamic title for the list
  const getListTitle = () => {
    let title = t('archives.list.allArchives');

    if (selectedType !== 'all') {
      title = t(`archives.list.${selectedType}Files`);
    }

    if (selectedDate) {
      const [year, month] = selectedDate.split('-');
      const monthName = new Date(year, month - 1).toLocaleString(i18n.language, { month: 'long' });
      title += ` ${t('archives.list.from')} ${monthName} ${year}`;
    }

    if (search) {
      title = `${t('archives.list.searchResultsFor')} "${search}"`;
    }

    return title;
  };

  return (
    <motion.div
      className="container pt-3 pb-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-center mb-3" style={{ color: primaryColor }}>
        <i className="bi bi-folder-fill me-2"></i>{t('archives.title')}
      </h2>

      <p className="text-center text-muted mx-auto" style={{ maxWidth: "720px" }}>
        {t('archives.subtitle')}
      </p>

      <hr className="my-4" style={{ borderTop: "2px solid #ccc", width: "120px", margin: "2rem auto" }} />
      
      <div className="row">
        <div className="col-12 d-flex flex-column align-items-center">
          <div className="card p-4 mb-3 archive-controls-card">
            <h5 className="card-title text-center mb-3">{t('archives.filterTitle')}</h5>
            <div className="d-flex justify-content-center align-items-center gap-2 mb-3 flex-wrap">
              {fileTypes.map(type => (
                <Button 
                  key={type} 
                  variant={selectedType === type ? "primary" : "outline-secondary"}
                  onClick={() => {
                    setSelectedType(type);
                    setCurrentPage(1); // Reset page on filter change
                  }}
                  className="rounded-circle btn-icon"
                >
                  {type === "all" 
                    ? <i className="bi bi-files"></i> 
                    : type === "excel"
                    ? <i className="bi bi-filetype-xlsx"></i>
                    : type === "document"
                    ? <i className="bi bi-filetype-doc"></i>
                    : type === "image"
                    ? <i className="bi bi-filetype-jpg"></i>
                    : <i className={`bi bi-filetype-${type}`}></i>}
                </Button>
              ))}
            </div>
            <div className="w-100 d-flex flex-column flex-md-row gap-2">
              <input
                type="text"
                placeholder={t('archives.searchPlaceholder')}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1); // Reset page on search change
                }}
                className="form-control"
              />
              <input
                type="month"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setCurrentPage(1); // Reset page on date change
                }}
                className="form-control"
              />
            </div>
          </div>
          
          {loading && <div className="text-center">Loading archives...</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          
          {!loading && !error && filteredFiles.length === 0 && (
            <div className="text-center">
              {t('archives.noFilesFound')}
            </div>
          )}

          {!loading && !error && filteredFiles.length > 0 && (
            <div className="w-100">
                <hr className="my-2" />
                <h5 className="text-center mb-3" style={{ color: primaryColor, fontWeight: 'bold' }}>
                    {getListTitle()}
                </h5>
                <div className="archives-list-container card p-3 shadow-sm">
                    <ul className="list-unstyled mb-0">
                        {currentFiles.map((file) => (
                            <li key={file.id} className="archives-list-item d-flex align-items-center mb-2 p-2">
                                <i className={`bi bi-filetype-${file.fileExt} me-3`}></i>
                                <div className="flex-grow-1">
                                    <h6 className="mb-0">{file.title}</h6>
                                    <small className="text-muted">{file.date}</small>
                                    <p className="mb-0 file-description">{file.description}</p>
                                </div>
                                <div className="archives-item-actions d-flex gap-2">
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => handleViewClick(file)}
                                        className="btn-icon-small"
                                        title={t('archives.view')}
                                    >
                                        <i className="bi bi-eye"></i>
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleDownloadClick(file)}
                                        className="btn-icon-small"
                                        title={t('archives.download')}
                                    >
                                        <i className="bi bi-download"></i>
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
          )}

          {/* Pagination Component */}
          {!loading && !error && totalPages > 1 && (
            <Pagination className="mt-4">
              <Pagination.Prev 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1} 
              />
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages} 
              />
            </Pagination>
          )}
        </div>
      </div>

      {/* CUSTOM MODAL for images only */}
      {modalShow && selectedFile && (selectedFile.fileExt === 'jpg' || selectedFile.fileExt === 'jpeg') && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <button className="custom-modal-close-button" onClick={() => setModalShow(false)}>
              &times;
            </button>
            <div className="modal-header">
              <h5 className="d-flex align-items-center mb-0">
                <i className={`bi bi-filetype-${selectedFile?.fileExt} me-2`}></i>
                {selectedFile?.title}
              </h5>
            </div>
            <div className="modal-image-container">
                <img src={selectedFile.fileUrl} alt={selectedFile.title} className="modal-image" />
            </div>
            <div className="modal-footer justify-content-center">
              <Button onClick={() => setModalShow(false)}>
                {t('archives.close')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
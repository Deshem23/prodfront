import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Button, Form, InputGroup, Spinner } from "react-bootstrap";
import {
  FaFilePdf,
  FaSearch,
  FaFacebookF,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const STRAPI_API_URL = import.meta.env.VITE_STRAPI_API_URL;

const Rapport = () => {
  const { t, i18n } = useTranslation(["rapport", "common"]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [data, setData] = useState([]);
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 6;

  // Responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch rapports (collection)
  useEffect(() => {
    const fetchRapports = async () => {
      try {
        setLoading(true);
        const query = [
          `locale=${i18n.language}`,
          "populate=*",
          `pagination[page]=${currentPage}`,
          `pagination[pageSize]=${itemsPerPage}`,
          debouncedSearch
            ? `filters[$or][0][title][$containsi]=${debouncedSearch}&filters[$or][1][description][$containsi]=${debouncedSearch}`
            : "",
        ].join("&");

        const res = await axios.get(`${STRAPI_API_URL}/rapports?${query}`);
        setData(res.data.data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch rapports");
      } finally {
        setLoading(false);
      }
    };
    fetchRapports();
  }, [i18n.language, currentPage, debouncedSearch]);

  // Fetch rapport-page (single type)
  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const res = await axios.get(
          `${STRAPI_API_URL}/rapport-page?locale=${i18n.language}`
        );
        setPageContent(res.data.data?.attributes || null);
      } catch (err) {
        console.error("Failed to fetch rapport-page:", err);
      }
    };
    fetchPageContent();
  }, [i18n.language]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Handle download
  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await axios.get(fileUrl, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
      window.open(fileUrl, "_blank");
    }
  };

  // Share
  const handleShare = (platform, item) => {
    const shareUrl = window.location.href;
    const text = `${item.attributes?.title} - ${shareUrl}`;
    let url = "";
    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        break;
      case "email":
        url = `mailto:?subject=${encodeURIComponent(
          item.attributes?.title
        )}&body=${encodeURIComponent(text)}`;
        break;
      default:
        return;
    }
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error) {
    return <p className="text-danger text-center">{t("common:error")}</p>;
  }

  return (
    <div className="container-fluid py-5">
      <div className="row">
        {/* Left side */}
        <div className="col-lg-9">
          <header className="text-center mb-5">
            <h1 className="fw-bold">
              {pageContent?.title || t("rapport:defaultTitle")}
            </h1>
            <p className="lead text-muted">
              {pageContent?.description || t("rapport:defaultDescription")}
            </p>
          </header>

          {/* Search */}
          <InputGroup className="mb-4">
            <Form.Control
              placeholder={t("common:searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="outline-secondary">
              <FaSearch />
            </Button>
          </InputGroup>

          {/* Rapport list */}
          <div className="row g-4">
            {data.length > 0 ? (
              data.map((item, idx) => {
                const attrs = item.attributes;
                const pdfFile = attrs.pdf?.data?.attributes?.url;
                const pdfUrl = pdfFile ? `${STRAPI_API_URL}${pdfFile}` : null;

                return (
                  <motion.div
                    key={item.id}
                    className="col-md-6 col-lg-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                  >
                    <div
                      className="card shadow-sm h-100 border-0"
                      onClick={() => setSelectedItem(item)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{attrs.title}</h5>
                        <p className="card-text text-muted text-truncate">
                          {attrs.description}
                        </p>
                        {pdfUrl && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(pdfUrl, attrs.title + ".pdf");
                            }}
                          >
                            <FaFilePdf className="me-1" /> {t("common:download")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <p className="text-center">{t("common:noResults")}</p>
            )}
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <Button
              variant="outline-primary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="me-2"
            >
              {t("common:prev")}
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              {t("common:next")}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        {!isMobile && (
          <div className="col-lg-3">
            <Sidebar />
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <Modal
            show
            onHide={() => setSelectedItem(null)}
            centered
            size="lg"
            className="rounded-3"
          >
            <Modal.Header closeButton>
              <Modal.Title>{selectedItem.attributes?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>{selectedItem.attributes?.description}</p>
              {selectedItem.attributes?.pdf?.data?.attributes?.url && (
                <Button
                  variant="danger"
                  className="me-2"
                  onClick={() =>
                    handleDownload(
                      `${STRAPI_API_URL}${selectedItem.attributes.pdf.data.attributes.url}`,
                      selectedItem.attributes?.title + ".pdf"
                    )
                  }
                >
                  <FaFilePdf className="me-1" /> {t("common:downloadPdf")}
                </Button>
              )}

              {/* Share buttons */}
              <div className="mt-4">
                <h6>{t("common:share")}</h6>
                <div className="d-flex gap-3 mt-2">
                  <Button
                    variant="outline-primary"
                    onClick={() => handleShare("facebook", selectedItem)}
                  >
                    <FaFacebookF />
                  </Button>
                  <Button
                    variant="outline-info"
                    onClick={() => handleShare("twitter", selectedItem)}
                  >
                    <FaXTwitter />
                  </Button>
                  <Button
                    variant="outline-success"
                    onClick={() => handleShare("whatsapp", selectedItem)}
                  >
                    <FaWhatsapp />
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleShare("email", selectedItem)}
                  >
                    <MdEmail />
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Rapport;
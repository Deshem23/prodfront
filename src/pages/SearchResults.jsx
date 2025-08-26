import { useLocation, useNavigate } from "react-router-dom";
// Assuming the path to your image is correct relative to this file
import norImage from "../assets/nor.png"; 

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const query = new URLSearchParams(location.search).get("q");

  // Function to navigate back one step in the history
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">
        <i className="bi bi-search me-2"></i>Résultats pour: <span className="text-primary">"{query}"</span>
      </h2>

      {/* This section replaces the previous alert. 
        It currently displays the "No results" message, image, and go back button 
        as the backend connection is a placeholder. 
      */}
      <div className="no-results-container text-center py-5 border rounded bg-light">
        
        {/* Image (nor.png) */}
        <img 
          src={norImage} 
          alt="No results found" 
          style={{ width: '250px', height: 'auto', marginBottom: '30px' }} 
        />

        {/* No Results Text (in French) */}
        <h3 className="text-danger mb-4">
          Désolé, il n'y a pas de résultats pour votre recherche "{query}".
        </h3>

        {/* Go Back Icon (Clickable and styled) */}
        <div 
          onClick={goBack} 
          className="d-inline-flex align-items-center justify-content-center p-3 rounded-pill" 
          style={{ 
            cursor: 'pointer', 
            // Using CONATEL's primary blue for the background
            backgroundColor: 'rgb(5, 40, 106)', 
            color: '#fff', 
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            transition: 'background-color 0.3s'
          }}
        >
          <i 
            className="bi bi-arrow-left-circle-fill me-2" 
            style={{ fontSize: '1.8rem' }}
          ></i>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Retourner</span>
        </div>
      </div>

      {/* Example structure for future results (Commented out) */}
      {/* <div className="list-group">
        ...
      </div> */}
    </div>
  );
}
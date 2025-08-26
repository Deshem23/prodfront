// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion"; // Import AnimatePresence
import Header from "./layout/Header";
import Navbar from "./layout/Navbar"; 
import Footer from "./layout/Footer"; 
import 'bootstrap-icons/font/bootstrap-icons.css';
import SearchResults from "./pages/SearchResults";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Import all existing page components
import About from "./pages/Apropos"; 
import Archives from "./pages/Archives"; 
import Decisions from "./pages/Decisions"; 
import Galerie from "./pages/Galerie"; 
import Chantiers from "./pages/Chantiers"; 
import Rapports from "./pages/Rapports"; 
import Actualites from "./pages/Actualites"; 
import Procedures from "./pages/Procedures"; 

function App() {
  const location = useLocation();

  return (
    <div className="d-flex flex-column min-vh-100">
      
      {/* Header and Navbar (Rendered on all pages) */}
      <Header />
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-grow-1 my-4">
        
        {/* Wrap Routes with AnimatePresence to enable page transitions */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Routes for existing pages */}
            <Route path="/a-propos" element={<About />} />
            <Route path="/actualites" element={<Actualites />} />
            <Route path="/archives" element={<Archives />} />
            
            {/* Corrected route to use the Procedures component */}
            <Route path="/procedures" element={<Procedures />} />
            
            {/* Routes for the other components you listed */}
            <Route path="/chantiers" element={<Chantiers />} />
            <Route path="/rapports" element={<Rapports />} />
            <Route path="/decisions" element={<Decisions />} />
            <Route path="/galerie" element={<Galerie />} />
          </Routes>
        </AnimatePresence>

      </div>
      
      {/* Footer (Rendered on all pages) */}
      <Footer />
    </div>
  );
}

export default App;
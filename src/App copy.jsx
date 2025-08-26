import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./layout/Header";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import CarouselSlider from "./components/CarouselSlider";
import SearchResults from "./pages/SearchResults";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Home from "./pages/Home"; // Assuming you have a Home page component

function App() {
  const location = useLocation();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Navbar />

      {/* Render the Carousel only on the Home page */}
      {location.pathname === "/" && <CarouselSlider />}

      <div className="container flex-grow-1 my-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          {/* Add other routes here */}
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
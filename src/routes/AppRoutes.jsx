// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Procedures from "../pages/Procedures";
import Actualites from "../pages/Actualites";
import Archives from "../pages/Archives";
import Chantiers from "../pages/Chantiers";
import Realisations from "../pages/Realisations";
import Decisions from "../pages/Decisions";
import Galerie from "../pages/Galerie";
import Contact from "../pages/Contact";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/a-propos" element={<About />} />
      <Route path="/procedures" element={<Procedures />} />
      <Route path="/actualites" element={<Actualites />} />
<Route path="/archives" element={<Archives />} />
<Route path="/chantiers" element={<Chantiers />} />
<Route path="/realisations" element={<Realisations />} />
<Route path="/decisions" element={<Decisions />} />
<Route path="/galerie" element={<Galerie />} />
<Route path="/contact" element={<Contact />} />
    </Routes>
  );
}
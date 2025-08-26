// src/components/MainLayout.jsx
import React from 'react';
import { motion } from 'framer-motion';
import RightSidebar from './RightSidebar';

export default function MainLayout({ children }) {
  return (
    <motion.div
      className="container py-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="row d-flex justify-content-between">
        <div className="col-lg-8 custom-width-73">
          {children}
        </div>
        <div className="col-lg-4 custom-width-27 mt-4 mt-lg-0">
          <RightSidebar />
        </div>
      </div>
    </motion.div>
  );
}
/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React from 'react';
// REMOVED: CategorySection
import TopSelling from '../../components/layout/TopSelling/TopSelling'; // 1. Add back
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 2. CategorySection component is now REMOVED */}
      
      {/* 3. TopSelling component is ADDED BACK */}
      <TopSelling />

    </motion.div>
  );
};

export default HomePage;
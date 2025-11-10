/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React from 'react';
import './LoadingSpinner.css';

/**
 * A reusable loading spinner component.
 * @param {object} props
 * @param {'small' | 'medium' | 'large'} [props.size='medium'] - The size of the spinner.
 */
const LoadingSpinner = ({ size = 'medium' }) => {
  return (
    <div className={`spinner-container ${size}`}>
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // Our language config
import App from './App';
import './index.css'; // Our global styles
import { Suspense } from 'react';

import { CartProvider } from './store/CartContext';
import { AuthProvider } from './store/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary'; // 1. Import

const AppLoading = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '24px',
      fontFamily: 'Poppins, sans-serif',
    }}
  >
    Loading NexCartBD...
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Suspense fallback={<AppLoading />}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          {/* 2. Wrap the core providers with ErrorBoundary */}
          <ErrorBoundary> 
            <AuthProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </AuthProvider>
          </ErrorBoundary>
        </BrowserRouter>
      </I18nextProvider>
    </Suspense>
  </React.StrictMode>
);
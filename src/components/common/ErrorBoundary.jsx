/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React from 'react';
import { useTranslation } from 'react-i18next';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI to show when an error occurs
      return (
        <div style={{ padding: '20px', textAlign: 'center', minHeight: '80vh', backgroundColor: '#fff', border: '2px solid #d9534f', margin: '40px', borderRadius: '12px' }}>
          <h1 style={{ color: '#d9534f', fontSize: '32px' }}>🚨 Application Error 🚨</h1>
          <p style={{ color: '#555', fontSize: '18px', marginBottom: '30px' }}>
            Sorry, something went wrong while rendering this part of the application.
          </p>
          
          <details style={{ textAlign: 'left', background: '#f4f4f4', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#111827' }}>
              Error Details: Click to view console error
            </summary>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px', marginTop: '10px' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '30px', padding: '10px 20px', background: '#0BA360', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
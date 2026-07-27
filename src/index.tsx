import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter as Router } from 'react-router-dom';

// Suppress browser extension runtime errors globally
const originalOnError = window.onerror;
window.onerror = (message, source, lineno, colno, error) => {
  const isExtensionError =
    (typeof message === 'string' && message.includes('_0x')) ||
    (typeof source === 'string' && (
      source.includes('webkit-masked-url') ||
      source.includes('chrome-extension') ||
      source.includes('moz-extension') ||
      source.includes('safari-extension')
    ));

  if (isExtensionError) return true; // suppress silently

  if (originalOnError) {
    return originalOnError(message, source, lineno, colno, error);
  }
  return false;
};

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason?.message || event.reason || '';
  if (
    typeof reason === 'string' &&
    (reason.includes('_0x') || reason.includes('webkit-masked-url'))
  ) {
    event.preventDefault(); // suppress silently
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Router>
    <App />
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

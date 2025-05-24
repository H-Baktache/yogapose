import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Vérifie que l'élément root existe
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Création de la racine React
const root = ReactDOM.createRoot(rootElement);

// Rendu de l'application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
); 
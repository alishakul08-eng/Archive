// frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx'; // Imports the main App component with all your routing

// Gets the 'root' element from index.html and tells React to render the application there.
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode helps highlight potential problems in the application
  <React.StrictMode>
    <App /> 
  </React.StrictMode>
);

// Note: If you named this file 'index.js', you may need to update the script tag in index.html to src="/src/index.js"  
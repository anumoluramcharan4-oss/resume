// ==========================================
// src/main.jsx — React App Entry Point
// ==========================================
// This is the very first file that runs.
// It mounts the React app into the HTML page.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Find the <div id="root"> in index.html and render our app inside it
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

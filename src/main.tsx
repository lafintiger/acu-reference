import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { simpleDb } from './lib/simpleDatabase'
import { initializeModalitySystem } from './lib/modality-system/init'

// Initialize systems
Promise.all([
  simpleDb.initialize(),
  initializeModalitySystem()
]).then(() => {
  console.log('✅ All systems initialized');
}).catch(error => {
  console.error('❌ Initialization failed:', error);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

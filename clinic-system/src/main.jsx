import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { db } from "./lib/firebase";
console.log("🔥 Firestore Config:", JSON.stringify(db._app._options, null, 2));
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

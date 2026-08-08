import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <Toaster 
      position="top-right"
      toastOptions={{
        style: {
          background: '#0f0f1a',
          color: '#ffffff',
          border: '1px solid rgba(240,180,41,0.3)',
        }
      }}
    />
  </BrowserRouter>
)

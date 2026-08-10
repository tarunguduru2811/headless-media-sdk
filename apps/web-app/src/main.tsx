import React from 'react';
import ReactDOM from 'react-dom/client';
import { MediaProvider, MediaClient } from '@media-sdk/react';
import App from './App';
import './index.css';

// Initialize the core client with the API Key from environment variables
const client = new MediaClient({ 
  apiKey: import.meta.env.VITE_PEXELS_API_KEY 
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MediaProvider client={client}>
      <App />
    </MediaProvider>
  </React.StrictMode>
);

import React from 'react';
// Fix: Use named import createRoot as react-dom/client does not have a default export in TS
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Fix: Remove syntax error 'we' and use createRoot directly
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
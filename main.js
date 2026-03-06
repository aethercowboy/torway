import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

import './index.html';
import './img/grid.png';

const appElement = document.getElementById('app');

if (appElement) {
  const root = createRoot(appElement);
  root.render(<App />);
}

if (typeof window !== 'undefined' && typeof window.$ === 'function') {
  window.$(document).foundation();
}

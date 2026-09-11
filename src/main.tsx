import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Automatically trigger native date picker when clicking anywhere in any date input field
if (typeof window !== 'undefined') {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (target && target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'date') {
      try {
        (target as HTMLInputElement).showPicker?.();
      } catch (_) {
        // Fallback silently if not supported
      }
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

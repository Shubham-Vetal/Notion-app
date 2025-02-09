import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import UserContext from './context/UserContext.jsx';
import { NotesProvider } from './context/NotesContext'; // Import NotesProvider
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContext>
      <NotesProvider> {/* Wrap the app with NotesProvider */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NotesProvider>
    </UserContext>
  </StrictMode>
);

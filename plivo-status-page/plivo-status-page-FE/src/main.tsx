import { Auth0Provider } from '@auth0/auth0-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';
import './main.css';

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position="bottom-right" toastOptions={{
      duration: 3000,
    }} />
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Auth0Provider>
  </StrictMode>,
)

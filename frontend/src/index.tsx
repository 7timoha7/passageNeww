import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './app/store';
import { Provider } from 'react-redux';
import { CircularProgress, ThemeProvider } from '@mui/material';
import './18n';
import { BrowserRouter } from 'react-router-dom';
import theme from './theme';
import { addInterceptors } from './axiosApi';
import { SnackbarProvider } from 'notistack';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './constants';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { StyledEngineProvider } from '@mui/system';

addInterceptors(store);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StyledEngineProvider injectFirst>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Suspense fallback={<CircularProgress />}>
            <ThemeProvider theme={theme}>
              <SnackbarProvider>
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                  <App />
                </GoogleOAuthProvider>
              </SnackbarProvider>
            </ThemeProvider>
          </Suspense>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StyledEngineProvider>,
);

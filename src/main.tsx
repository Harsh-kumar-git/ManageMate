import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/auth/Login'; 
import RegisterPage from './pages/auth/Register'; 

// Extension error workaround
window.addEventListener('error', (e) => {
  if (e.message.includes('message port closed')) {
    e.preventDefault();
    return false;
  }
  return true;
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> }
    ]
  }
]);

if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser');
  await worker.start();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

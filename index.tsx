
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import HelpCenter from './pages/HelpCenter';
import Contact from './pages/Contact';

// Simple router based on pathname
const getPage = () => {
  const path = window.location.pathname;
  switch (path) {
    case '/terms':
      return <Terms />;
    case '/privacy':
      return <Privacy />;
    case '/help':
      return <HelpCenter />;
    case '/contact':
      return <Contact />;
    default:
      return <App />;
  }
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {getPage()}
  </React.StrictMode>
);

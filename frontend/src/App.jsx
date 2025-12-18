import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import CookieConsent from './components/CookieConsent';
import { cookieManager } from './utils/cookies';
import { healthAPI } from './services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';

function App() {
  useEffect(() => {

    healthAPI.check()
      .then(response => {
        console.log('API Health:', response.data);
      })
      .catch(error => {
        console.warn('API health check failed:', error);
      });

    const theme = cookieManager.getTheme();
    document.documentElement.setAttribute('data-theme', theme);

    if (cookieManager.hasConsent()) {
      cookieManager.trackEvent('page_view', {
        path: window.location.pathname,
        referrer: document.referrer
      });
    }

    const cleanupOldData = () => {
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      const recentEvents = events.filter(event => 
        new Date(event.timestamp).getTime() > oneWeekAgo
      );
      localStorage.setItem('analytics_events', JSON.stringify(recentEvents));
    };

    cleanupOldData();
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Routes>
        </main>
        <Footer />
        <CookieConsent />
      </div>
    </Router>
  );
}

export default App;
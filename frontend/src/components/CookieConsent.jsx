import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { cookieManager } from '../utils/cookies';

const CookieConsent = () => {
  const [show, setShow] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);

  useEffect(() => {
    const consent = cookieManager.getConsent();
    if (!consent) {

      const timer = setTimeout(() => {
        setShow(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = (type = 'all') => {
    cookieManager.setConsent('accepted');
    setShow(false);

    cookieManager.trackEvent('cookie_consent_accepted', { type });

    cookieManager.setPreference('theme', 'light');
    cookieManager.setPreference('notifications', false);
  };

  const handleDecline = () => {
    cookieManager.setConsent('declined');
    setShow(false);

    ['pref_theme', 'pref_notifications'].forEach(key => {
      Cookies.remove(key);
    });
  };

  const handleCustomize = () => {
    setDetailsVisible(!detailsVisible);
  };

  if (!show) return null;

  return (
    <Modal 
      show={show} 
      backdrop="static" 
      keyboard={false} 
      centered
      className="cookie-consent-modal"
      animation={false}
    >
      <Modal.Header className="border-0 pb-0">
        <Modal.Title className="h5">
          🍪 Использование cookies
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="pt-0">
        <p className="mb-3">
          Мы используем файлы cookie для улучшения работы сайта, анализа трафика 
          и персонализации контента. Некоторые cookies необходимы для работы сайта.
        </p>
        
        {detailsVisible && (
          <div className="cookie-details mb-3 p-3 bg-light rounded">
            <h6 className="mb-2">Типы используемых cookies:</h6>
            <ul className="small mb-0">
              <li className="mb-1">
                <strong>Необходимые:</strong> Для работы основных функций сайта
              </li>
              <li className="mb-1">
                <strong>Предпочтения:</strong> Запоминают ваши настройки (тема, язык)
              </li>
              <li className="mb-1">
                <strong>Аналитические:</strong> Помогают улучшать сайт на основе статистики
              </li>
            </ul>
            <p className="small mt-2 mb-0">
              Подробнее в нашей{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Политике конфиденциальности
              </a>
            </p>
          </div>
        )}
        
        <div className="d-flex justify-content-between align-items-center">
          <Button 
            variant="link" 
            size="sm" 
            onClick={handleCustomize}
            className="text-decoration-none p-0"
          >
            {detailsVisible ? 'Скрыть детали' : 'Подробнее'}
          </Button>
          
          <div className="d-flex gap-2">
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={handleDecline}
            >
              Отклонить
            </Button>
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => handleAccept('necessary')}
            >
              Только необходимые
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => handleAccept('all')}
              className="btn-primary"
            >
              Принять все
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CookieConsent;
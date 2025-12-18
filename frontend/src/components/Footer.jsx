import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={6}>
            <h5 className="mb-3">Психолог Анна</h5>
            <p>Профессиональная психологическая помощь и поддержка. 
            Гештальт-терапия, консультации онлайн и очно.</p>
          </Col>
          <Col md={3}>
            <h6 className="mb-3">Навигация</h6>
            <ul className="list-unstyled">
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/about">Обо мне</Link></li>
              <li><Link to="/services">Услуги</Link></li>
              <li><Link to="/contact">Контакты</Link></li>
            </ul>
          </Col>
          <Col md={3}>
            <h6 className="mb-3">Контакты</h6>
            <ul className="list-unstyled">
              <li>Email: anna@example.com</li>
              <li>Телефон: +7 (999) 123-45-67</li>
              <li className="social-links mt-2">
                <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
                <a href="#" aria-label="Telegram"><i className="bi bi-telegram"></i></a>
                <a href="#" aria-label="WhatsApp"><i className="bi bi-whatsapp"></i></a>
              </li>
            </ul>
          </Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col md={6}>
            <p>&copy; 2025 Психолог Анна. Все права защищены.</p>
          </Col>
          <Col md={6} className="text-md-end">
            <Link to="/privacy">Политика конфиденциальности</Link>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
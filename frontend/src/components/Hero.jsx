import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import terapevtImg from '../image/terapevt.jpg';

const Hero = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <section className="hero">
      <Container>
        <Row className="align-items-center min-vh-100">
          <Col lg={6} data-aos="fade-right">
            <h1 className="display-4 fw-light mb-4">
              Пространство для <span className="text-accent">вашего</span> внутреннего роста
            </h1>
            <p className="lead mb-4">
              Профессиональная психологическая помощь в формате гештальт-терапии. 
              Помогаю обрести гармонию, понять себя и улучшить качество жизни.
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <Button as={Link} to="/contact" size="lg" className="btn-primary">
                Записаться на консультацию
              </Button>
              <Button as={Link} to="/about" variant="outline" size="lg" className="btn-outline">
                Узнать больше
              </Button>
            </div>
          </Col>
          <Col lg={6} data-aos="fade-left" data-aos-delay="200">
            <div className="text-center">
              <div 
                className="rounded-lg bg-soft shadow-soft mx-auto"
                style={{
                  width: '400px',
                  height: '400px',
                  background: 'linear-gradient(135deg, #eadbc8 0%, #dac0a3 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span style={{ color: '#5a4d41', fontSize: '1.2rem' }}>
                  <img src={terapevtImg} alt="Терапевт"
                    style={{
                      width: '400px',
                      height: 'auto',
                      maxWidth: '100%',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}/>
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Hero;
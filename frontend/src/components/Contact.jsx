import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import AOS from 'aos';
import { useAppointment } from '../hooks/useAppointment';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferred_date: '',
    preferred_time: '',
    service_type: 'individual'
  });

  const { createAppointment, loading, error, success, reset } = useAppointment();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error || success) {
      reset();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createAppointment(formData);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        preferred_date: '',
        preferred_time: '',
        service_type: 'individual'
      });
    } catch (err) {
      console.error('Appointment submission error:', err);
    }
  };

  return (
    <section id="contact" className="section section-light">
      <Container>
        <Row>
          <Col lg={8} className="mx-auto">
            <div className="text-center mb-5">
              <h2 data-aos="fade-up">Свяжитесь со мной</h2>
              <p data-aos="fade-up" data-aos-delay="200">
                Готова помочь вам на пути к гармонии и самопониманию
              </p>
            </div>
          </Col>
        </Row>
        
        {success && (
          <Row className="mb-4">
            <Col lg={8} className="mx-auto">
              <Alert variant="success" data-aos="fade-up">
                <Alert.Heading>✅ Заявка отправлена!</Alert.Heading>
                <p className="mb-0">
                  Спасибо за вашу заявку! Я свяжусь с вами в ближайшее время для уточнения деталей.
                </p>
              </Alert>
            </Col>
          </Row>
        )}

        {error && (
          <Row className="mb-4">
            <Col lg={8} className="mx-auto">
              <Alert variant="danger" data-aos="fade-up">
                <Alert.Heading>❌ Ошибка отправки</Alert.Heading>
                <p className="mb-0">{error}</p>
              </Alert>
            </Col>
          </Row>
        )}

        <Row>
          <Col lg={8} className="mx-auto">
            <Card data-aos="fade-up" data-aos-delay="400">
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Имя *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Ваше имя"
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="your@email.com"
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Телефон</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+7 (999) 999-99-99"
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Тип консультации *</Form.Label>
                        <Form.Select
                          name="service_type"
                          value={formData.service_type}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        >
                          <option value="individual">Индивидуальная</option>
                          <option value="couple">Парная</option>
                          <option value="online">Онлайн</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Предпочтительная дата</Form.Label>
                        <Form.Control
                          type="date"
                          name="preferred_date"
                          value={formData.preferred_date}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Предпочтительное время</Form.Label>
                        <Form.Control
                          type="time"
                          name="preferred_time"
                          value={formData.preferred_time}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>Сообщение *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Расскажите о вашем запросе..."
                      disabled={loading}
                    />
                  </Form.Group>
                  
                  <div className="text-center">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Отправка...' : 'Отправить сообщение'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row className="mt-5">
          <Col md={4} className="text-center" data-aos="fade-up">
            <div className="mb-3">
              <i className="bi bi-envelope display-6 text-accent"></i>
            </div>
            <h5>Email</h5>
            <p>hello@example.com</p>
          </Col>
          <Col md={4} className="text-center" data-aos="fade-up" data-aos-delay="200">
            <div className="mb-3">
              <i className="bi bi-telephone display-6 text-accent"></i>
            </div>
            <h5>Телефон</h5>
            <p>+7 (999) 123-45-67</p>
          </Col>
          <Col md={4} className="text-center" data-aos="fade-up" data-aos-delay="400">
            <div className="mb-3">
              <i className="bi bi-clock display-6 text-accent"></i>
            </div>
            <h5>Часы работы</h5>
            <p>Пн-Пт: 9:00-20:00<br/>Сб: 10:00-16:00</p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Contact;
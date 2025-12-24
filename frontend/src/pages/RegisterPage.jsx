import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setServerError(result.message);
      if (result.errors) {
        setErrors(result.errors);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="register-page py-5" style={{ minHeight: 'calc(100vh - 200px)', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={7} lg={6}>
            <Card className="shadow-lg border-0" style={{ borderRadius: '16px' }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold" style={{ color: '#2d3748' }}>Регистрация</h2>
                  <p className="text-muted">Создайте аккаунт для записи на консультации</p>
                </div>

                {serverError && (
                  <Alert variant="danger" className="mb-4">
                    {serverError}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Имя *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Ваше имя"
                          isInvalid={!!errors.name}
                          style={{ borderRadius: '10px' }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name?.[0]}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Телефон</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+7 (999) 123-45-67"
                          isInvalid={!!errors.phone}
                          style={{ borderRadius: '10px' }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phone?.[0]}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Email *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      isInvalid={!!errors.email}
                      style={{ borderRadius: '10px' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email?.[0]}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Пароль *</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Минимум 8 символов"
                          isInvalid={!!errors.password}
                          style={{ borderRadius: '10px' }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password?.[0]}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Подтвердите пароль *</Form.Label>
                        <Form.Control
                          type="password"
                          name="password_confirmation"
                          value={formData.password_confirmation}
                          onChange={handleChange}
                          placeholder="Повторите пароль"
                          isInvalid={!!errors.password_confirmation}
                          style={{ borderRadius: '10px' }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password_confirmation?.[0]}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    type="submit"
                    className="w-100 py-3 fw-semibold mt-3"
                    disabled={loading}
                    style={{ 
                      borderRadius: '10px', 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      fontSize: '1.1rem'
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Регистрация...
                      </>
                    ) : (
                      'Создать аккаунт'
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Уже есть аккаунт?{' '}
                    <Link to="/login" className="fw-semibold" style={{ color: '#667eea' }}>
                      Войти
                    </Link>
                  </p>
                </div>

                <div className="text-center mt-3">
                  <Link to="/" className="text-muted small">
                    ← Вернуться на главную
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;


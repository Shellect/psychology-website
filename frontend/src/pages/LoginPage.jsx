import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  
  const { login } = useAuth();
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

    const result = await login(formData.email, formData.password);
    
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
    <div className="login-page py-5" style={{ minHeight: 'calc(100vh - 200px)', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-lg border-0" style={{ borderRadius: '16px' }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold" style={{ color: '#2d3748' }}>Добро пожаловать</h2>
                  <p className="text-muted">Войдите в личный кабинет</p>
                </div>

                {serverError && (
                  <Alert variant="danger" className="mb-4">
                    {serverError}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Введите email"
                      isInvalid={!!errors.email}
                      size="lg"
                      style={{ borderRadius: '10px' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Пароль</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Введите пароль"
                      isInvalid={!!errors.password}
                      size="lg"
                      style={{ borderRadius: '10px' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 py-3 fw-semibold"
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
                        Вход...
                      </>
                    ) : (
                      'Войти'
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Нет аккаунта?{' '}
                    <Link to="/register" className="fw-semibold" style={{ color: '#667eea' }}>
                      Зарегистрироваться
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

export default LoginPage;


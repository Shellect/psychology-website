import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, loading, isAuthenticated, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const dataToSend = {
      name: formData.name,
      phone: formData.phone,
    };

    if (formData.new_password) {
      dataToSend.current_password = formData.current_password;
      dataToSend.new_password = formData.new_password;
      dataToSend.new_password_confirmation = formData.new_password_confirmation;
    }

    const result = await updateProfile(dataToSend);
    
    if (result.success) {
      setSuccess('Профиль успешно обновлён');
      setFormData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      }));
    } else {
      setError(result.message);
      if (result.errors) {
        setErrors(result.errors);
      }
    }
    
    setSaving(false);
  };

  return (
    <div className="profile-page py-5" style={{ minHeight: 'calc(100vh - 200px)', background: '#f8fafc' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-sm border-0" style={{ borderRadius: '16px' }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontSize: '2rem',
                      color: 'white'
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="fw-bold" style={{ color: '#2d3748' }}>{user?.name}</h3>
                  <p className="text-muted">{user?.email}</p>
                  <span className={`badge ${user?.role === 'admin' ? 'bg-warning' : 'bg-primary'}`}>
                    {user?.role === 'admin' ? 'Администратор' : 'Клиент'}
                  </span>
                </div>

                {success && <Alert variant="success">{success}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <h5 className="mb-3 mt-4">Основная информация</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Имя</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                      style={{ borderRadius: '10px' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name?.[0]}
                    </Form.Control.Feedback>
                  </Form.Group>

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

                  <h5 className="mb-3 mt-4">Изменить пароль</h5>
                  <p className="text-muted small">Оставьте поля пустыми, если не хотите менять пароль</p>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Текущий пароль</Form.Label>
                    <Form.Control
                      type="password"
                      name="current_password"
                      value={formData.current_password}
                      onChange={handleChange}
                      isInvalid={!!errors.current_password}
                      style={{ borderRadius: '10px' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.current_password?.[0]}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Новый пароль</Form.Label>
                        <Form.Control
                          type="password"
                          name="new_password"
                          value={formData.new_password}
                          onChange={handleChange}
                          isInvalid={!!errors.new_password}
                          style={{ borderRadius: '10px' }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.new_password?.[0]}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Подтвердите пароль</Form.Label>
                        <Form.Control
                          type="password"
                          name="new_password_confirmation"
                          value={formData.new_password_confirmation}
                          onChange={handleChange}
                          style={{ borderRadius: '10px' }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    type="submit"
                    className="w-100 py-3 fw-semibold mt-3"
                    disabled={saving}
                    style={{ 
                      borderRadius: '10px', 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none'
                    }}
                  >
                    {saving ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Сохранение...
                      </>
                    ) : (
                      'Сохранить изменения'
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfilePage;


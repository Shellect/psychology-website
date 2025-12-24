import { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Table, Badge, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../services/api';

const ClientDashboard = () => {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, appointmentsRes] = await Promise.all([
        dashboardAPI.getMyStats(),
        dashboardAPI.getMyAppointments()
      ]);
      
      setStats(statsRes.data.data);
      setAppointments(appointmentsRes.data.data);
    } catch (err) {
      setError('Ошибка загрузки данных');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePayment = async (paymentMethod) => {
    if (!selectedAppointment) return;
    
    setPaymentLoading(true);
    try {
      await dashboardAPI.processPayment(selectedAppointment.id, paymentMethod);
      setPaymentSuccess(true);
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccess(false);
        fetchData();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка оплаты');
    }
    setPaymentLoading(false);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      confirmed: 'info',
      completed: 'success',
      cancelled: 'danger',
    };
    const labels = {
      pending: 'Ожидает подтверждения',
      confirmed: 'Подтверждено',
      completed: 'Завершено',
      cancelled: 'Отменено',
    };
    return <Badge bg={variants[status]}>{labels[status]}</Badge>;
  };

  const getPaymentBadge = (status) => {
    const variants = {
      pending: 'secondary',
      paid: 'success',
      refunded: 'warning',
    };
    const labels = {
      pending: 'Ожидает оплаты',
      paid: 'Оплачено',
      refunded: 'Возврат',
    };
    return <Badge bg={variants[status]}>{labels[status]}</Badge>;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatPrice = (price) => {
    if (!price) return '—';
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(price);
  };

  const getServiceTypeName = (type) => {
    const names = {
      individual: 'Индивидуальная консультация',
      couple: 'Парная консультация',
      online: 'Онлайн консультация',
    };
    return names[type] || type;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <Card.Body className="text-center">
              <div className="display-6 fw-bold text-primary">{stats?.total_appointments || 0}</div>
              <div className="text-muted small">Всего записей</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <Card.Body className="text-center">
              <div className="display-6 fw-bold text-info">{stats?.upcoming_appointments || 0}</div>
              <div className="text-muted small">Предстоящих</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <Card.Body className="text-center">
              <div className="display-6 fw-bold text-warning">{stats?.pending_payments || 0}</div>
              <div className="text-muted small">Ожидают оплаты</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <Card.Body className="text-center">
              <div className="display-6 fw-bold text-success">{formatPrice(stats?.total_paid)}</div>
              <div className="text-muted small">Оплачено</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Card.Body className="text-center py-4">
          <h5 className="text-white mb-3">Хотите записаться на новую консультацию?</h5>
          <Link to="/contact">
            <Button variant="light" size="lg" className="fw-semibold px-5">
              📅 Записаться на консультацию
            </Button>
          </Link>
        </Card.Body>
      </Card>

      {/* Appointments List */}
      <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
        <Card.Header className="bg-white border-0 py-3">
          <h5 className="mb-0 fw-bold">Мои записи</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {appointments.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3" style={{ fontSize: '4rem' }}>📋</div>
              <h5 className="text-muted">У вас пока нет записей</h5>
              <p className="text-muted">Запишитесь на первую консультацию!</p>
              <Link to="/contact">
                <Button variant="primary">Записаться</Button>
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Дата</th>
                    <th>Тип консультации</th>
                    <th>Статус</th>
                    <th>Оплата</th>
                    <th>Цена</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(apt => (
                    <tr key={apt.id}>
                      <td>
                        <div className="fw-semibold">{formatDate(apt.preferred_date)}</div>
                        {apt.preferred_time && (
                          <small className="text-muted">{apt.preferred_time}</small>
                        )}
                      </td>
                      <td>{getServiceTypeName(apt.service_type)}</td>
                      <td>{getStatusBadge(apt.status)}</td>
                      <td>{getPaymentBadge(apt.payment_status)}</td>
                      <td className="fw-semibold">{formatPrice(apt.price)}</td>
                      <td>
                        {apt.status === 'confirmed' && apt.payment_status === 'pending' && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => {
                              setSelectedAppointment(apt);
                              setShowPaymentModal(true);
                            }}
                          >
                            💳 Оплатить
                          </Button>
                        )}
                        {apt.payment_status === 'paid' && (
                          <span className="text-success">✓ Оплачено</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => !paymentLoading && setShowPaymentModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>💳 Оплата консультации</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {paymentSuccess ? (
            <div className="text-center py-4">
              <div style={{ fontSize: '4rem' }}>✅</div>
              <h4 className="text-success mt-3">Оплата успешна!</h4>
              <p className="text-muted">Спасибо за оплату. Ждём вас на консультации!</p>
            </div>
          ) : selectedAppointment && (
            <div>
              <div className="bg-light p-3 rounded mb-4">
                <h6 className="mb-2">Детали записи:</h6>
                <p className="mb-1"><strong>Дата:</strong> {formatDate(selectedAppointment.preferred_date)}</p>
                <p className="mb-1"><strong>Время:</strong> {selectedAppointment.preferred_time || 'Уточняется'}</p>
                <p className="mb-0"><strong>Тип:</strong> {getServiceTypeName(selectedAppointment.service_type)}</p>
              </div>
              
              <div className="text-center mb-4">
                <h3 className="fw-bold text-primary">{formatPrice(selectedAppointment.price)}</h3>
              </div>

              <h6 className="mb-3">Выберите способ оплаты:</h6>
              <div className="d-grid gap-2">
                <Button
                  variant="outline-primary"
                  size="lg"
                  disabled={paymentLoading}
                  onClick={() => handlePayment('card')}
                  className="d-flex align-items-center justify-content-center gap-2"
                >
                  {paymentLoading ? <Spinner size="sm" /> : '💳'} Банковская карта
                </Button>
                <Button
                  variant="outline-primary"
                  size="lg"
                  disabled={paymentLoading}
                  onClick={() => handlePayment('sbp')}
                  className="d-flex align-items-center justify-content-center gap-2"
                >
                  {paymentLoading ? <Spinner size="sm" /> : '📱'} СБП (Система быстрых платежей)
                </Button>
              </div>

              <p className="text-muted small text-center mt-3">
                Оплата безопасна и защищена шифрованием
              </p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ClientDashboard;


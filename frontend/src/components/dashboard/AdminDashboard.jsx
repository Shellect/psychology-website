import { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Table, Badge, Button, Form, Spinner, Alert, Modal, Pagination } from 'react-bootstrap';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    payment_status: 'all',
  });
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, appointmentsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAppointments({ ...filters, page: pagination.current_page })
      ]);
      
      setStats(statsRes.data.data);
      setAppointments(appointmentsRes.data.data.data);
      setPagination({
        current_page: appointmentsRes.data.data.current_page,
        last_page: appointmentsRes.data.data.last_page
      });
    } catch (err) {
      setError('Ошибка загрузки данных');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current_page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(true);
    try {
      await adminAPI.updateAppointmentStatus(id, newStatus);
      fetchData();
      setShowModal(false);
    } catch (err) {
      setError('Ошибка обновления статуса');
    }
    setActionLoading(false);
  };

  const handleMarkPaid = async (id) => {
    setActionLoading(true);
    try {
      await adminAPI.markPaymentComplete(id);
      fetchData();
      setShowModal(false);
    } catch (err) {
      setError('Ошибка отметки оплаты');
    }
    setActionLoading(false);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      confirmed: 'info',
      completed: 'success',
      cancelled: 'danger',
    };
    const labels = {
      pending: 'Ожидает',
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
      pending: 'Не оплачено',
      paid: 'Оплачено',
      refunded: 'Возврат',
    };
    return <Badge bg={variants[status]}>{labels[status]}</Badge>;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU');
  };

  const formatPrice = (price) => {
    if (!price) return '—';
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(price);
  };

  if (loading && !stats) {
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
              <div className="display-6 fw-bold text-warning">{stats?.pending_appointments || 0}</div>
              <div className="text-muted small">Ожидают подтверждения</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <Card.Body className="text-center">
              <div className="display-6 fw-bold text-info">{stats?.today_appointments || 0}</div>
              <div className="text-muted small">Сегодня</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <Card.Body className="text-center">
              <div className="display-6 fw-bold text-success">{formatPrice(stats?.total_revenue)}</div>
              <div className="text-muted small">Доход</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <Card.Body className="text-center">
              <div className="h4 fw-bold text-success">{stats?.confirmed_appointments || 0}</div>
              <div className="text-muted small">Подтверждено</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <Card.Body className="text-center">
              <div className="h4 fw-bold text-secondary">{stats?.completed_appointments || 0}</div>
              <div className="text-muted small">Завершено</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <Card.Body className="text-center">
              <div className="h4 fw-bold text-danger">{stats?.pending_payments || 0}</div>
              <div className="text-muted small">Ожидают оплаты</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <Card.Body className="text-center">
              <div className="h4 fw-bold text-primary">{stats?.total_clients || 0}</div>
              <div className="text-muted small">Клиентов</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Статус записи</Form.Label>
                <Form.Select name="status" value={filters.status} onChange={handleFilterChange}>
                  <option value="all">Все статусы</option>
                  <option value="pending">Ожидает</option>
                  <option value="confirmed">Подтверждено</option>
                  <option value="completed">Завершено</option>
                  <option value="cancelled">Отменено</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Статус оплаты</Form.Label>
                <Form.Select name="payment_status" value={filters.payment_status} onChange={handleFilterChange}>
                  <option value="all">Все</option>
                  <option value="pending">Не оплачено</option>
                  <option value="paid">Оплачено</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={fetchData}>
                🔄 Обновить
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Appointments Table */}
      <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
        <Card.Header className="bg-white border-0 py-3">
          <h5 className="mb-0 fw-bold">Записи на консультации</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>ID</th>
                  <th>Клиент</th>
                  <th>Тип</th>
                  <th>Дата</th>
                  <th>Статус</th>
                  <th>Оплата</th>
                  <th>Цена</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">
                      Записей не найдено
                    </td>
                  </tr>
                ) : (
                  appointments.map(apt => (
                    <tr key={apt.id}>
                      <td>#{apt.id}</td>
                      <td>
                        <div className="fw-semibold">{apt.name}</div>
                        <small className="text-muted">{apt.email}</small>
                      </td>
                      <td>
                        <Badge bg="light" text="dark">
                          {apt.service_type === 'individual' ? 'Индивидуальная' : 
                           apt.service_type === 'couple' ? 'Парная' : 'Онлайн'}
                        </Badge>
                      </td>
                      <td>
                        {formatDate(apt.preferred_date)}
                        {apt.preferred_time && <small className="d-block text-muted">{apt.preferred_time}</small>}
                      </td>
                      <td>{getStatusBadge(apt.status)}</td>
                      <td>{getPaymentBadge(apt.payment_status)}</td>
                      <td>{formatPrice(apt.price)}</td>
                      <td>
                        <Button 
                          size="sm" 
                          variant="outline-primary"
                          onClick={() => { setSelectedAppointment(apt); setShowModal(true); }}
                        >
                          Управление
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
        {pagination.last_page > 1 && (
          <Card.Footer className="bg-white border-0">
            <Pagination className="mb-0 justify-content-center">
              <Pagination.Prev 
                disabled={pagination.current_page === 1}
                onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))}
              />
              {[...Array(pagination.last_page)].map((_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === pagination.current_page}
                  onClick={() => setPagination(prev => ({ ...prev, current_page: i + 1 }))}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next 
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))}
              />
            </Pagination>
          </Card.Footer>
        )}
      </Card>

      {/* Appointment Management Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Управление записью #{selectedAppointment?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div>
              <p><strong>Клиент:</strong> {selectedAppointment.name}</p>
              <p><strong>Email:</strong> {selectedAppointment.email}</p>
              <p><strong>Телефон:</strong> {selectedAppointment.phone || '—'}</p>
              <p><strong>Тип:</strong> {selectedAppointment.service_type}</p>
              <p><strong>Дата:</strong> {formatDate(selectedAppointment.preferred_date)} {selectedAppointment.preferred_time}</p>
              <p><strong>Сообщение:</strong> {selectedAppointment.message}</p>
              <hr />
              <p><strong>Текущий статус:</strong> {getStatusBadge(selectedAppointment.status)}</p>
              <p><strong>Оплата:</strong> {getPaymentBadge(selectedAppointment.payment_status)}</p>
              <p><strong>Цена:</strong> {formatPrice(selectedAppointment.price)}</p>
              
              <hr />
              <h6>Изменить статус:</h6>
              <div className="d-flex gap-2 flex-wrap mb-3">
                {['pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                  <Button
                    key={status}
                    size="sm"
                    variant={selectedAppointment.status === status ? 'primary' : 'outline-primary'}
                    disabled={actionLoading || selectedAppointment.status === status}
                    onClick={() => handleStatusChange(selectedAppointment.id, status)}
                  >
                    {status === 'pending' && 'Ожидает'}
                    {status === 'confirmed' && 'Подтвердить'}
                    {status === 'completed' && 'Завершить'}
                    {status === 'cancelled' && 'Отменить'}
                  </Button>
                ))}
              </div>

              {selectedAppointment.payment_status !== 'paid' && selectedAppointment.status === 'confirmed' && (
                <Button
                  variant="success"
                  disabled={actionLoading}
                  onClick={() => handleMarkPaid(selectedAppointment.id)}
                >
                  💳 Отметить как оплачено
                </Button>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AdminDashboard;


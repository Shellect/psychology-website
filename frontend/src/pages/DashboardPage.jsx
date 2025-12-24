import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import ClientDashboard from '../components/dashboard/ClientDashboard';
import { Container, Spinner } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

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

  return (
    <div className="dashboard-page py-4" style={{ minHeight: 'calc(100vh - 200px)', background: '#f8fafc' }}>
      <Container>
        <div className="mb-4">
          <h2 className="fw-bold" style={{ color: '#2d3748' }}>
            Привет, {user?.name}! 👋
          </h2>
          <p className="text-muted">
            {isAdmin ? 'Панель администратора' : 'Ваш личный кабинет'}
          </p>
        </div>
        
        {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
      </Container>
    </div>
  );
};

export default DashboardPage;


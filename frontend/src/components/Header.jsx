import { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" fixed="top" className={scrolled ? 'scrolled' : ''}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          Психолог Анна
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Главная
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/about" 
              className={location.pathname === '/about' ? 'active' : ''}
            >
              Обо мне
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/services" 
              className={location.pathname === '/services' ? 'active' : ''}
            >
              Услуги
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/contact" 
              className={location.pathname === '/contact' ? 'active' : ''}
            >
              Контакты
            </Nav.Link>

            {isAuthenticated ? (
              <Dropdown align="end" className="ms-2">
                <Dropdown.Toggle 
                  variant="outline-primary" 
                  id="user-dropdown"
                  className="d-flex align-items-center gap-2"
                  style={{ borderRadius: '20px' }}
                >
                  <span className="d-none d-md-inline">{user?.name}</span>
                  {isAdmin && <span className="badge bg-warning text-dark ms-1">Admin</span>}
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                  <Dropdown.Item as={Link} to="/dashboard">
                    📊 {isAdmin ? 'Панель управления' : 'Личный кабинет'}
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/profile">
                    👤 Профиль
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    🚪 Выйти
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="d-flex gap-2 ms-2">
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-primary"
                  size="sm"
                  style={{ borderRadius: '20px' }}
                >
                  Войти
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="primary"
                  size="sm"
                  style={{ borderRadius: '20px' }}
                >
                  Регистрация
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

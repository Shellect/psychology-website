import { Container, Row, Col, Card } from 'react-bootstrap';
import { useEffect } from 'react';
import AOS from 'aos';
import terapevtImg from '../image/terapevt_me.jpg';

const AboutPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <Container className="py-5 mt-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <div data-aos="fade-up">
            <h1 className="text-center mb-5">Обо мне</h1>
            
            <Row className="mb-5">
              <Col md={4} className="mb-4">
                <div 
                  className="rounded-lg bg-accent mx-auto"
                  style={{
                    width: '250px',
                    height: '250px',
                    background: 'linear-gradient(135deg, #eadbc8 0%, #dac0a3 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}
                >
                  <span style={{ color: '#5a4d41' }}><img src={terapevtImg} alt='Терапевт2' 
                      style={{
                        width: '250px',
                        height: 'auto',
                        maxWidth: '100%',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        marginTop: '30px'
                      }} /></span>
                </div>
              </Col>
              <Col md={8}>
                <h3 className="mb-3">Анна, профессиональный психолог</h3>
                <p className="lead">
                  Сертифицированный гештальт-терапевт с более чем 5-летним опытом работы
                </p>
                <p>
                  Моя профессиональная карьера началась с получения высшего психологического 
                  образования в Московском государственном университете, после чего я прошла 
                  специализацию по гештальт-терапии в Московском институте гештальта и психодрамы.
                </p>
                <p>
                  Регулярно участвую в профессиональных конференциях и супервизиях, 
                  что позволяет мне оставаться в курсе современных тенденций в психологии 
                  и постоянно совершенствовать свои навыки.
                </p>
              </Col>
            </Row>

            <div data-aos="fade-up" data-aos-delay="200">
              <h3 className="mb-4">Образование и сертификаты</h3>
              <Row>
                <Col md={6} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>Высшее образование</Card.Title>
                      <Card.Text>
                        Московский государственный университет<br/>
                        Факультет психологии<br/>
                        2015-2019
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>Гештальт-терапия</Card.Title>
                      <Card.Text>
                        Московский институт гештальта и психодрамы<br/>
                        Сертификат специалиста<br/>
                        2019-2021
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>Курсы повышения</Card.Title>
                      <Card.Text>
                        Работа с травмой и ПТСР<br/>
                        Институт психотерапии<br/>
                        2022
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>Сертификация</Card.Title>
                      <Card.Text>
                        Европейская ассоциация гештальт-терапии (EAGT)<br/>
                        Действительный член, c 2021 года
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>

            <div data-aos="fade-up" data-aos-delay="400" className="mt-5">
              <h3 className="mb-4">Мой подход</h3>
              <p>
                В своей работе я придерживаюсь принципов гештальт-подхода, который рассматривает 
                человека как целостную систему, неразрывно связанную с окружающей средой. 
                Основное внимание уделяется осознаванию того, что происходит "здесь и сейчас", 
                завершению незавершенных ситуаций и развитию способности к саморегуляции.
              </p>
              <p>
                Я создаю безопасное, принимающее пространство, где вы сможете исследовать 
                свои чувства, мысли и поведенческие паттерны. Вместе мы будем работать над 
                тем, чтобы вы смогли лучше понимать себя, свои потребности и находить 
                ресурсы для решения жизненных вызовов.
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage;
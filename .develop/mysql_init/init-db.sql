CREATE DATABASE IF NOT EXISTS psychologist_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

DROP USER IF EXISTS 'psychologist_user'@'localhost';
CREATE USER 'psychologist_user'@'localhost' 
IDENTIFIED BY 'Psychologist@123';

GRANT ALL PRIVILEGES ON psychologist_db.* 
TO 'psychologist_user'@'localhost';

FLUSH PRIVILEGES;

USE psychologist_db;

DROP TABLE IF EXISTS appointments;

CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    message TEXT NOT NULL,
    preferred_date DATE DEFAULT NULL,
    preferred_time TIME DEFAULT NULL,
    service_type ENUM('individual', 'couple', 'online') DEFAULT 'individual',
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    cookie_consent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_service_type (service_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO appointments (name, email, phone, message, preferred_date, preferred_time, service_type, status, ip_address, user_agent, cookie_consent) VALUES
('Иван Иванов', 'ivan@example.com', '+7 (999) 123-45-67', 'Нужна консультация по вопросам тревожности и панических атак. Ситуация длится около 3 месяцев.', '2024-01-15', '14:00:00', 'individual', 'pending', '127.0.0.1', 'Mozilla/5.0 (Test)', TRUE),
('Мария Петрова', 'maria@example.com', '+7 (999) 987-65-43', 'Ищем семейного психолога для работы с проблемами в отношениях. В браке 5 лет.', '2024-01-16', '15:30:00', 'couple', 'confirmed', '127.0.0.1', 'Mozilla/5.0 (Test)', TRUE),
('Алексей Смирнов', 'alex@example.com', NULL, 'Интересуюсь онлайн консультациями. Живу в другом городе.', '2024-01-17', '10:00:00', 'online', 'pending', '127.0.0.1', 'Mozilla/5.0 (Test)', TRUE),
('Елена Ковалева', 'elena@example.com', '+7 (999) 456-78-90', 'Помощь в преодолении стресса на работе. Работаю в крупной IT компании.', '2024-01-14', '11:00:00', 'individual', 'completed', '127.0.0.1', 'Mozilla/5.0 (Test)', TRUE);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'psychologist', 'assistant') DEFAULT 'psychologist',
    remember_token VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (name, email, password, role, email_verified_at) VALUES
('Администратор', 'admin@psychologist.ru', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NOW());

SELECT '=== APPOINTMENTS TABLE ===' as '';
SELECT * FROM appointments;

SELECT '=== USERS TABLE ===' as '';
SELECT id, name, email, role, created_at FROM users;

SELECT '=== TABLE STRUCTURE ===' as '';
DESCRIBE appointments;
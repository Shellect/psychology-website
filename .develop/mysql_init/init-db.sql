CREATE DATABASE IF NOT EXISTS psychologist_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'psychologist_user'@'%' 
IDENTIFIED BY 'Psychologist@123';

GRANT ALL PRIVILEGES ON psychologist_db.* 
TO 'psychologist_user'@'%';

FLUSH PRIVILEGES;

USE psychologist_db;

CREATE TABLE IF NOT EXISTS appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    message TEXT NOT NULL,
    preferred_date DATE,
    preferred_time TIME,
    service_type ENUM('individual', 'couple', 'online') DEFAULT 'individual',
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    ip_address VARCHAR(45),
    user_agent TEXT,
    cookie_consent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_service_type (service_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO appointments (name, email, phone, message, service_type, status) VALUES
('Иван Иванов', 'ivan@example.com', '+7 (999) 123-45-67', 'Нужна консультация по вопросам тревожности и панических атак. Ситуация длится около 3 месяцев.', 'individual', 'pending'),
('Мария Петрова', 'maria@example.com', '+7 (999) 987-65-43', 'Ищем семейного психолога для работы с проблемами в отношениях. В браке 5 лет.', 'couple', 'confirmed'),
('Алексей Смирнов', 'alex@example.com', NULL, 'Интересуюсь онлайн консультациями. Живу в другом городе.', 'online', 'pending'),
('Елена Ковалева', 'elena@example.com', '+7 (999) 456-78-90', 'Помощь в преодолении стресса на работе. Работаю в крупной IT компании.', 'individual', 'completed')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'psychologist', 'assistant') DEFAULT 'psychologist',
    remember_token VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (name, email, password, role) VALUES
('Администратор', 'admin@psychologist.ru', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;
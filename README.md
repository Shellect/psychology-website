# Сайт психолога - Full-Stack проект

Полнофункциональный веб-сайт для психолога с современным стеком технологий.

## Технологии

### Frontend
- **React 18** - UI библиотека
- **Vite** - Сборщик и dev сервер
- **Bootstrap 5** + **React Bootstrap** - Стилизация
- **SCSS** - Препроцессор CSS
- **Axios** - HTTP клиент
- **AOS** - Анимации при скролле

### Backend
- **Laravel 10** - PHP фреймворк
- **MySQL 8** - База данных
- **Nginx** - Веб-сервер
- **Docker** + **Docker Compose** - Контейнеризация
- **PHP 8.2** - Язык программирования

## Быстрый старт

### Требования
- Windows 10/11 с WSL 2
- Docker Desktop
- Node.js 18+ (опционально для разработки)

### Автоматический запуск (рекомендуется)

1. **Скачайте** все файлы проекта в одну папку
2. **Запустите** `start-project.bat` двойным кликом
3. **Ждите** завершения автоматической настройки (5-10 минут)
4. **Сайт** откроется автоматически: http://localhost:8000

### Ручной запуск

```bash
# 1. Запуск контейнеров
docker-compose up -d

# 2. Инициализация Laravel
docker exec psychologist_php composer install
docker exec psychologist_php php artisan key:generate

# 3. Установка зависимостей React
cd frontend
npm install
npm run dev

# 4. Откройте http://localhost:8000
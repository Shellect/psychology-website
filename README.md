# Персональный сайт психолога

Полнофункциональный веб-сайт для психолога с системой онлайн-записи на консультации
и управление клиентской базой

Цель проекта: Создание современного инструмента для психологов, позволяющего автоматизировать процесс записи клиентов, ведения клиентской базы и управления консультациями

### Для развертывания выполните:

1. Клонируйте репозиторий:\
```bash
git clone https://github.com/Tanya-ProCoder/psychology-website
cd psychology-website
```

2. Настройте переменные окружения:\
```bash
cd .env.example .env
```

3. Соберите статику:\

- для Linux/macOS:
```bash
make build-static
```

- для Windows:
```cmd
.\scripts\build-static.bat
```

4. Примените миграции:\

- для Linux/macOS:
```bash
source ./scripts/migrate.sh
```

- для Windows:
```cmd
.\scripts\migrate.bat
```

5. Поднимите контейнеры:\

- для Linux/macOS:
```bash
make serve
```

- для Windows:
```cmd
docker compose up -d
```

6. Откройте http://localhost:8000
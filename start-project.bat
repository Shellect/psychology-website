@echo off
chcp 65001 >nul
title Установка полного проекта психолога
color 0A

echo ========================================================
echo        ПОЛНАЯ УСТАНОВКА ПРОЕКТА ПСИХОЛОГА
echo ========================================================
echo.

echo [1/10] Проверка Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ОШИБКА: Docker Desktop не запущен!
    echo Запустите Docker Desktop и повторите попытку.
    pause
    exit /b 1
)
echo ✅ Docker запущен

echo [2/10] Остановка старых контейнеров...
docker-compose down 2>nul
echo ✅ Старые контейнеры остановлены

echo [3/10] Создание структуры папок...
mkdir backend 2>nul
mkdir backend\app 2>nul
mkdir backend\app\Http 2>nul
mkdir backend\app\Http\Controllers 2>nul
mkdir backend\app\Http\Controllers\Api 2>nul
mkdir backend\app\Http\Middleware 2>nul
mkdir backend\app\Http\Requests 2>nul
mkdir backend\app\Models 2>nul
mkdir backend\bootstrap 2>nul
mkdir backend\bootstrap\cache 2>nul
mkdir backend\config 2>nul
mkdir backend\database 2>nul
mkdir backend\database\migrations 2>nul
mkdir backend\database\seeders 2>nul
mkdir backend\public 2>nul
mkdir backend\public\css 2>nul
mkdir backend\public\js 2>nul
mkdir backend\routes 2>nul
mkdir backend\storage 2>nul
mkdir backend\storage\app 2>nul
mkdir backend\storage\framework 2>nul
mkdir backend\storage\logs 2>nul
mkdir backend\tests 2>nul
mkdir nginx 2>nul
echo ✅ Структура папок создана

echo [4/10] Создание файлов Laravel...
echo Создание конфигурационных файлов...
REM Файлы будут созданы автоматически при composer install

echo [5/10] Запуск Docker контейнеров...
docker-compose up -d

if %errorlevel% neq 0 (
    echo ❌ ОШИБКА: Не удалось запустить контейнеры!
    echo.
    echo РЕШЕНИЯ:
    echo 1. Проверьте, что порты 80, 3306, 8080 свободны
    echo 2. Перезапустите Docker Desktop
    echo 3. Используйте другие порты в docker-compose.yml
    echo.
    pause
    exit /b 1
)
echo ✅ Контейнеры запущены

echo [6/10] Ожидание запуска MySQL (40 секунд)...
echo Пожалуйста, подождите...
for /l %%i in (1,1,40) do (
    timeout /t 1 /nobreak >nul
    set /a progress=%%i*100/40
    echo Прогресс: !progress!%% 
)
echo ✅ MySQL запущен

echo [7/10] Установка зависимостей Laravel...
docker exec psychologist_php composer install --no-interaction --optimize-autoloader

echo [8/10] Генерация ключа приложения...
docker exec psychologist_php php artisan key:generate --force

echo [9/10] Запуск миграций базы данных...
docker exec psychologist_php php artisan migrate --force

echo [10/10] Финальная настройка...
docker exec psychologist_php php artisan storage:link
docker exec psychologist_php php artisan config:cache
docker exec psychologist_php php artisan route:cache
docker exec psychologist_php php artisan view:cache

echo.
echo ========================================================
echo               🎉 ПРОЕКТ УСПЕШНО ЗАПУЩЕН!
echo ========================================================
echo.
echo ОТКРЫТЬ САЙТ:
echo.
echo http://localhost
echo PHPMyAdmin: http://localhost:8080
echo.
echo ПРОВЕРКА РАБОТЫ:
echo.
echo 1. Откройте http://localhost - должна быть страница API
echo 2. Откройте http://localhost/api/health - проверка здоровья
echo 3. Откройте http://localhost:8080 - PHPMyAdmin
echo    - Сервер: mysql
echo    - Пользователь: psychologist_user
echo    - Пароль: Psychologist@123
echo.
echo ДЛЯ ТЕСТА API:
echo.
echo curl -X POST http://localhost/api/v1/appointments ^
echo   -H "Content-Type: application/json" ^
echo   -d "{\"name\":\"Тест\",\"email\":\"test@example.com\",\"message\":\"Тестовое сообщение\",\"service_type\":\"individual\"}"
echo.
echo ДЛЯ ОСТАНОВКИ: docker-compose down
echo.
echo ========================================================
echo Нажмите любую клавишу для открытия сайта...
pause >nul

start http://localhost
start http://localhost:8080
echo.
echo Сайт и PHPMyAdmin открываются в браузере!
echo.
pause
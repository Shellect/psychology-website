@echo off
REM Скрипт для наполнения DB

echo Applying database migrations...
docker exec laravel php /app/artisan db:seed

if %errorlevel% equ 0 (
    echo Migrations applied successfully!
) else (
    echo Failed to apply migrations!
)
pause
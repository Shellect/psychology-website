@echo off
REM Скрипт для применения миграций

echo Applying database migrations...
docker exec laravel php /app/artisan migrate

if %errorlevel% equ 0 (
    echo Migrations applied successfully!
) else (
    echo Failed to apply migrations!
)
pause
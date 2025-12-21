@echo off
echo 📦 Сборка статики проекта...
cd frontend
call npm install
call npm run build
cd ..
xcopy /E /I frontend\dist\* public\
php artisan storage:link
php artisan optimize:clear
echo ✅ Статика собрана успешно!
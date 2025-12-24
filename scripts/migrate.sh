#!/bin/bash
echo 'Applying database migrations...'
docker exec laravel php /app/artisan migrate

if [ $? -eq 0 ]; then
    echo 'Migrations applied successfully!'
    echo ''
    echo 'Running seeders...'
    docker exec laravel php /app/artisan db:seed
    
    if [ $? -eq 0 ]; then
        echo 'Seeders applied successfully!'
        echo ''
        echo 'Admin credentials:'
        echo '  Email: admin@psychology.ru'
        echo '  Password: admin123'
        echo ''
        echo 'Test client credentials:'
        echo '  Email: client@example.com'
        echo '  Password: client123'
    else
        echo 'Failed to apply seeders!'
    fi
else
    echo 'Failed to apply migrations!'
fi
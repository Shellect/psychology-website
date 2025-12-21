echo 'Applying database migrations...'
docker exec laravel php /app/artisan migrate

if [ $? -eq 0 ]; then
    echo 'Migrations applied successfully!'
else
    echo 'Failed to apply migrations!'
fi
#!/bin/bash
set -e

composer install --no-interaction --optimize-autoloader

if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then
    php artisan key:generate --force
fi

php artisan config:cache
php artisan route:cache
php artisan migrate --force

if [ "$APP_ENV" = "local" ] || [ "$APP_ENV" = "develop" ]; then
    php artisan db:seed --force
fi
exec "$@"


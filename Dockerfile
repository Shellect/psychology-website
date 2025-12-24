FROM php:8.2.12-fpm

RUN apt-get update \
    && apt-get install -y libfcgi-bin libzip-dev unzip\
    && docker-php-ext-install pdo_mysql zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
COPY .develop/php-fpm-healthcheck.conf /usr/local/etc/php-fpm.d/zz-healthcheck.conf
WORKDIR /app
COPY .develop/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["php-fpm"]
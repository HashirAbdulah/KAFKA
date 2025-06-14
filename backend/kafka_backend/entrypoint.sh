#!/bin/sh
set -e  # Exit on any error

# Default values if not set
SQL_HOST=${SQL_HOST:-db}
SQL_PORT=${SQL_PORT:-5432}

# Validate email settings
if [ -z "$EMAIL_HOST_USER" ] || [ -z "$EMAIL_HOST_PASSWORD" ]; then
    echo "Error: Email settings are not properly configured."
    echo "Please ensure EMAIL_HOST_USER and EMAIL_HOST_PASSWORD are set in your .env file."
    exit 1
fi

# Wait for the database
echo "Waiting for database at $SQL_HOST:$SQL_PORT..."
while ! nc -z "$SQL_HOST" "$SQL_PORT"; do
  sleep 0.5
done
echo "Database is ready!"

# Apply migrations
python manage.py makemigrations --noinput
python manage.py migrate --noinput

# Execute the command passed to the container
exec "$@"

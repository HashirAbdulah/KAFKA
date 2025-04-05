# Use a stable Python image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Avoid generating .pyc files and buffer output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# Copy entrypoint and application files
COPY entrypoint.sh .
COPY . .

# # Ensure entrypoint is executable and has Unix line endings
RUN chmod +x entrypoint.sh && \
    sed -i 's/\r$//g' entrypoint.sh

# # Set entrypoint
ENTRYPOINT ["./entrypoint.sh"]

# Default command
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

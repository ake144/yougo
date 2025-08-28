#!/bin/bash

echo "Setting up environment variables for YouGo Church Backend"
echo "========================================================"

# Check if .env file exists
if [ -f ".env" ]; then
    echo "Warning: .env file already exists. This will overwrite it."
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 1
    fi
fi

# Get database configuration
echo "Please provide your MySQL database configuration:"
read -p "Database Host (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Database Port (default: 3306): " DB_PORT
DB_PORT=${DB_PORT:-3306}

read -p "Database Username (default: root): " DB_USER
DB_USER=${DB_USER:-root}

read -s -p "Database Password: " DB_PASSWORD
echo

read -p "Database Name (default: yougo_church): " DB_NAME
DB_NAME=${DB_NAME:-yougo_church}

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Create .env file
cat > .env << EOF
# Database Configuration
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME

# JWT Configuration
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development
EOF

echo
echo "✅ Environment file created successfully!"
echo "📁 File: .env"
echo
echo "Next steps:"
echo "1. Make sure your MySQL server is running"
echo "2. Create the database: CREATE DATABASE $DB_NAME;"
echo "3. Run: npm run start:dev"
echo
echo "Note: Keep your .env file secure and never commit it to version control!" 
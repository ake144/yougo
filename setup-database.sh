#!/bin/bash

echo "Setting up YouGo Church Database"
echo "================================"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please run ./setup-env.sh first to create the .env file."
    exit 1
fi

# Load environment variables
source .env

echo "📊 Database Configuration:"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   User: $DB_USER"
echo "   Database: $DB_NAME"
echo

# Check if MySQL is accessible
echo "🔍 Testing MySQL connection..."
if ! mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ Error: Cannot connect to MySQL!"
    echo "Please check your MySQL server and credentials."
    exit 1
fi

echo "✅ MySQL connection successful!"

# Run the database setup SQL
echo "📝 Creating database tables..."
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" < database-setup.sql

if [ $? -eq 0 ]; then
    echo "✅ Database tables created successfully!"
    echo
    echo "📋 Database Summary:"
    echo "   - User table created with all required fields"
    echo "   - Attendance table created with foreign key relationship"
    echo "   - Sample admin user created (admin@yougochurch.com)"
    echo
    echo "🚀 You can now start the backend server:"
    echo "   npm run start:dev"
else
    echo "❌ Error: Failed to create database tables!"
    exit 1
fi 
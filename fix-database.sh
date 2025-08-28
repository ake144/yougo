#!/bin/bash

echo "Fixing YouGo Church Database Constraints"
echo "========================================"

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

# Run the database fix SQL
echo "🔧 Fixing database constraints..."
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" < fix-database.sql

if [ $? -eq 0 ]; then
    echo "✅ Database constraints fixed successfully!"
    echo
    echo "📋 What was fixed:"
    echo "   - Removed problematic email constraints"
    echo "   - Recreated tables with proper structure"
    echo "   - Maintained foreign key relationships"
    echo
    echo "🚀 You can now start the backend server:"
    echo "   npm run start:dev"
else
    echo "❌ Error: Failed to fix database constraints!"
    exit 1
fi 
# Environment Setup Guide

## Quick Setup (Recommended)

Run the setup script:
```bash
./setup-env.sh
```

## Manual Setup

If you prefer to create the `.env` file manually, create a file named `.env` in the backend directory with the following content:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=yougo_church

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development
```

## Database Setup

1. **Start MySQL Server**
   ```bash
   sudo systemctl start mysql
   # or
   sudo service mysql start
   ```

2. **Create Database**
   ```sql
   CREATE DATABASE yougo_church;
   ```

3. **Verify Connection**
   ```bash
   mysql -u root -p -h localhost
   ```

## Troubleshooting

### "Access denied for user" Error
- Check if MySQL is running
- Verify username and password
- Ensure the user has access to the database
- Try connecting manually: `mysql -u your_user -p`

### "Database doesn't exist" Error
- Create the database: `CREATE DATABASE yougo_church;`
- Grant permissions: `GRANT ALL PRIVILEGES ON yougo_church.* TO 'your_user'@'localhost';`

### Environment Variables Not Loading
- Make sure `.env` file is in the backend root directory
- Check file permissions
- Restart the development server after creating `.env`

## Security Notes

- Never commit `.env` files to version control
- Use strong passwords for production
- Generate a secure JWT secret for production
- Consider using environment-specific configurations 
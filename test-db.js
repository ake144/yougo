const mysql = require('mysql2/promise');

async function testDatabase() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // Update this with your MySQL password
      database: 'yougo_church'
    });

    console.log('✅ Database connection successful');

    // Test UUID generation
    const [uuidResult] = await connection.execute('SELECT UUID() as uuid');
    console.log('✅ UUID generation test:', uuidResult[0].uuid);

    // Check User table structure
    const [userStructure] = await connection.execute('DESCRIBE User');
    console.log('✅ User table structure:');
    userStructure.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key === 'PRI' ? 'PRIMARY KEY' : ''}`);
    });

    // Check existing users
    const [users] = await connection.execute('SELECT id, name, email, role FROM User LIMIT 5');
    console.log('✅ Existing users:');
    users.forEach(user => {
      console.log(`  - ID: ${user.id || 'NULL'} | Name: ${user.name} | Role: ${user.role}`);
    });

    // Check for users with empty IDs
    const [emptyIdUsers] = await connection.execute('SELECT COUNT(*) as count FROM User WHERE id IS NULL OR id = ""');
    console.log(`✅ Users with empty IDs: ${emptyIdUsers[0].count}`);

    // Test creating a user with UUID
    const testUserId = uuidResult[0].uuid;
    const [insertResult] = await connection.execute(
      'INSERT INTO User (id, name, email, role) VALUES (?, ?, ?, ?)',
      [testUserId, 'Test User', 'test@example.com', 'USER']
    );
    console.log('✅ Test user created with ID:', testUserId);

    // Clean up test user
    await connection.execute('DELETE FROM User WHERE id = ?', [testUserId]);
    console.log('✅ Test user cleaned up');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('  - Check your MySQL username and password');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('  - Database "yougo_church" does not exist');
      console.error('  - Run the database setup script first');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ Database connection closed');
    }
  }
}

testDatabase(); 
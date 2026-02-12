require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10
});

async function testConnection() {
    try {
        const conn = await pool.getConnection();
        await conn.ping();
        conn.release();
        console.log('Conectado a la base de datos');
    } catch (err) {
        console.error('Error de conexión en la base de datos', err.message);
        process.exit(1);
    }
}

module.exports = { pool, testConnection };

const { Pool } = require('pg'); 
require('dotenv').config(); 


const pool = new Pool({ 
    host: process.env.DB_HOST, 
    port: process.env.DB_PORT, 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    max: 20, 
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 2000, 
});


pool.query('SELECT NOW()')
    .then(() => console.log('Pool de conexão com o PostgreSQL inicializado com sucesso.'))
    .catch(err => console.error('Erro ao conectar no PostgreSQL:', err));

module.exports = pool;
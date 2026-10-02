import mysql from 'mysql2/promise';


// credencias ainda vem do ambiente local, por enquanto
export const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306 ),
  user: process.env.DB_USER || 'receitas',
  password: process.env.DB_PASSWORD || 'receitas',
  database: process.env.DB_NAME || 'teste_receitas_rg_sistemas',
  waitForConnections: true,
  connectionLimit: 10
});

import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
const port = Number(process.env.PORT || 3000);


const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'receitas',
  password: process.env.DB_PASSWORD || 'receitas',
  database: process.env.DB_NAME || 'teste_receitas_rg_sistemas',
  waitForConnections: true,
  connectionLimit: 10
});

app.use(express.json());

app.get('/health', async (_req, res ) => {
  let code  = 200;
  let result = { status: 'ok', database: 'conectado' };

  try {
    // confere a conexao
    await db.query('SELECT 1');
  } catch {
   code = 503;
    result = {
      status: 'error',
      database: 'disconectado'
    };
  }

  res.status(code).json(result);
});

app.listen(port, () => {
   console.log(`API rodando na portaa ${port}`);
});

import express from 'express';
import { authRoutes } from './auth';
import { db } from './db';


const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(authRoutes( db ));

app.get('/health', async (_req, res) => {
  let code = 200;
  let result = { status: 'ok', database: 'conectado' };

  try {
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
  console.log('API rodando na portaa ' + port);
});

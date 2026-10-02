import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { authRoutes } from './auth';
import { db } from './db';
import { swaggerDocument } from './swagger';


const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());
app.get('/api-docs.json', (_req, res) => res.json(swaggerDocument));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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

import { Router } from 'express';
import type { Pool } from 'mysql2/promise';

export function healthRoutes(db: Pool) {
  const router = Router();

  router.get('/health', async (_req, res) => {
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

  return router;
}

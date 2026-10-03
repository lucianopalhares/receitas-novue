import { Router } from 'express';
import type { ReceitaController } from './ReceitaController';

export function receitaRoutes (controller: ReceitaController) {
  const router = Router();


  router.get('/receitas', controller.listar);
  router.post('/receitas', controller.cadastrar);
  router.get('/receitas/:id', controller.consultar);
  router.put('/receitas/:id', controller.atualizar);
  router.delete('/receitas/:id', controller.excluir);

  return router;
}

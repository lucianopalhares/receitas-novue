import { Router } from 'express';
import type { CategoriaController } from './CategoriaController';


export function categoriaRoutes(controller: CategoriaController) {

  const router = Router();

    router.get('/categorias', controller.listar);

    return router;
}

import type { CategoriaRepositorio } from './portas/CategoriaRepositorio';

export class ListarCategorias {
    constructor(private categorias: CategoriaRepositorio) {}

  executar() {
      return this.categorias.listar();
  }
}

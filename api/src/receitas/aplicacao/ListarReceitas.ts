import type { ReceitaRepositorio } from './portas/ReceitaRepositorio';

export class ListarReceitas {

  constructor(private receitas: ReceitaRepositorio) {}

  async executar(usuarioId: number, termo?: string) {
    return this.receitas.listar(usuarioId, termo?.trim() || undefined);
  }

}

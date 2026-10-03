import type { ReceitaRepositorio } from './portas/ReceitaRepositorio';

export class ExcluirReceita {

  constructor(private receitas: ReceitaRepositorio) {}

  async executar(usuarioId: number, id: number) {
      return this.receitas.remover(usuarioId, id);
  }

}

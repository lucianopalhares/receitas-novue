import type { ReceitaRepositorio } from './portas/ReceitaRepositorio';

export class ConsultarReceita {
  constructor(private receitas: ReceitaRepositorio) {}

  async executar(usuarioId: number, id: number) {

    return this.receitas.buscarPorId(usuarioId, id);
  }
}

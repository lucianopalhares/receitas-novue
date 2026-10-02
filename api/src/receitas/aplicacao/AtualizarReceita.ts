import type { ReceitaRepositorio } from './portas/ReceitaRepositorio';
import { validarDadosReceita } from './dadosReceita';

export class AtualizarReceita {

  constructor(private receitas: ReceitaRepositorio) {}

  async executar(usuarioId: number, id: number, entrada: unknown) {

    return this.receitas.atualizar(usuarioId, id, validarDadosReceita(entrada));
  }

}

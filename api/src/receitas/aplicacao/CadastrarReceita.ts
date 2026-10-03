import type { ReceitaRepositorio } from './portas/ReceitaRepositorio';
import { validarDadosReceita } from './dadosReceita';

export class CadastrarReceita {
  constructor(private receitas: ReceitaRepositorio) {}

  async executar(usuarioId: number, entrada: unknown) {

    return this.receitas.criar(usuarioId, validarDadosReceita(entrada));
  }
  
}

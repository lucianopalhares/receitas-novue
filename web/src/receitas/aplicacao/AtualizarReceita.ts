import type { DadosReceita } from '../dominio/Receita';
import type { ReceitaApi } from './portas/ReceitaApi';


export class AtualizarReceita {
  constructor(private api: ReceitaApi) {}

  executar(id: number, dados: DadosReceita) {
    return this.api.atualizar(id, dados);
      }
}

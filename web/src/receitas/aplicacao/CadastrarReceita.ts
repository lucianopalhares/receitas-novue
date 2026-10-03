import type { DadosReceita } from '../dominio/Receita';
import type { ReceitaApi } from './portas/ReceitaApi';


export class CadastrarReceita {
  constructor(private api: ReceitaApi) {}

  executar(dados: DadosReceita) {
    return this.api.cadastrar(dados);
      }
}

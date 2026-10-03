import type { ReceitaApi } from './portas/ReceitaApi';

export class ExcluirReceita {
    constructor(private api: ReceitaApi) {}

      executar(id: number) {
    return this.api.excluir(id);
  }
}

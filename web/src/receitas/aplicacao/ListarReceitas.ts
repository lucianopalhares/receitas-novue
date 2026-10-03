import type { ReceitaApi } from './portas/ReceitaApi';

export class ListarReceitas {
    constructor(private api: ReceitaApi) {}

      executar(termo?: string) {
    return this.api.listar(termo);
  }
}

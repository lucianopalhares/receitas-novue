import type { ReceitaApi } from './portas/ReceitaApi';

export class ConsultarReceita {
    constructor(private api: ReceitaApi) {}

      executar(id: number) {
    return this.api.consultar(id);
  }
}

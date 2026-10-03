import type { ReceitaApi } from './portas/ReceitaApi';

// consuta simples para preencher as opcoes do select.
export class ListarCategorias {
    constructor(private api: ReceitaApi) {}

  executar() {
      return this.api.listarCategorias();
  }
}

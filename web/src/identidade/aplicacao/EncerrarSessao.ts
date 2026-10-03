import type { IdentidadeApi } from './portas/IdentidadeApi';
import type { SessaoStore } from './portas/SessaoStore';

export class EncerrarSessao {
  constructor(
    private api: IdentidadeApi,
    private sessoes: SessaoStore
  ) {}

  async executar(): Promise<void> {
    const token = this.sessoes.obterToken();

    try {
      if (token) await this.api.sair(token);
    } catch {
      // O navegador tambem encerra a sessão se a API estiver fora
    } finally {
      this.sessoes.limpar();
    }
  }
}

import type { Usuario } from '../dominio/Usuario';
import type { IdentidadeApi } from './portas/IdentidadeApi';
import type { SessaoStore } from './portas/SessaoStore';

export class ConsultarSessao {
  constructor(
    private api: IdentidadeApi,
    private sessoes: SessaoStore
  ) {}

  async executar(): Promise<Usuario | null> {
    const token = this.sessoes.obterToken();
    if (!token) {
      return null;
    }

    try {
      return await this.api.consultarUsuario(token);
    } catch {
      this.sessoes.limpar();
      return null;
    }
  }
}

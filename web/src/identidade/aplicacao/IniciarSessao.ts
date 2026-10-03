import type { Sessao } from '../dominio/Usuario';
import type { IdentidadeApi } from './portas/IdentidadeApi';
import type { SessaoStore } from './portas/SessaoStore';

export class IniciarSessao {
  constructor(
    private api: IdentidadeApi,
    private sessoes: SessaoStore
  ) {}

  async executar(login: string, senha: string): Promise<Sessao> {
    const sessao = await this.api.entrar(login, senha);

    this.sessoes.salvarToken(sessao.token);
    return sessao;
  }
}

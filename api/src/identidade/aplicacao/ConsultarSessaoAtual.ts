import type { SessaoRepositorio } from './portas/SessaoRepositorio';
import type { TokenSessao } from './portas/TokenSessao';
import { SessaoInvalida, TokenSessaoObrigatorio } from './erros';

export class ConsultarSessaoAtual {

  constructor(
    private sessoes: SessaoRepositorio,
    private tokens: TokenSessao
  ) {

  }

  async executar(token: string | null) {
    if (!token) {
      throw new TokenSessaoObrigatorio();
    }

    const dados = await this.sessoes.buscarPorTokenHash(this.tokens.hash(token));
    if (!dados || !dados.sessao.ativaEm()) {
       throw new SessaoInvalida();
    }

    return dados.usuario;
  }

}

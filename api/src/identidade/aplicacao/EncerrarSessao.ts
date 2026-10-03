import type { SessaoRepositorio } from './portas/SessaoRepositorio';
import type { TokenSessao } from './portas/TokenSessao';
import { TokenSessaoObrigatorio } from './erros';

export class EncerrarSessao {
  constructor(
    private sessoes: SessaoRepositorio,
    private tokens: TokenSessao
  ) {

  }

  async executar(token: string | null) {
    if (!token) {
      throw new TokenSessaoObrigatorio();
    }


    await this.sessoes.removerPorTokenHash(this.tokens.hash(token));
  }
}

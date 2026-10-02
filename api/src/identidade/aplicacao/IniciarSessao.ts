import type { PasswordHasher } from './portas/PasswordHasher';
import type { SessaoRepositorio } from './portas/SessaoRepositorio';
import type { TokenSessao } from './portas/TokenSessao';
import type { UsuarioRepositorio } from './portas/UsuarioRepositorio';
import { CredenciaisInvalidas, DadosLoginInvalidos } from './erros';
import { Sessao } from '../dominio/Sessao';

type EntradaLogin = {
  login: unknown;
  senha: unknown;
};

export class IniciarSessao {
  constructor(
    private usuarios: UsuarioRepositorio,
    private sessoes: SessaoRepositorio,
    private senhas: PasswordHasher,
    private tokens: TokenSessao
  ) {}

  async executar(entrada: EntradaLogin) {

    const login = typeof entrada.login === 'string' ? entrada.login.trim() : '';
    const senha = typeof entrada.senha === 'string' ? entrada.senha : '';

    if ( !login || !senha ) {
      throw new DadosLoginInvalidos();
    }

    const dados = await this.usuarios.buscarPorLogin(login);

    if (!dados || !this.senhas.verificar(senha, dados.senhaHash)) {
      throw new CredenciaisInvalidas();
    }

    const token = this.tokens.gerar();

    const sessao = new Sessao(
      dados.usuario.id,
      this.tokens.hash(token),
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    await this.sessoes.criar(sessao);

    return { token, usuario: dados.usuario };

  }
}

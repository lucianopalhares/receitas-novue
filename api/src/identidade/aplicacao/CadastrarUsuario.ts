import type { PasswordHasher } from './portas/PasswordHasher';
import type { UsuarioRepositorio } from './portas/UsuarioRepositorio';
import { CadastroInvalido } from './erros';

type EntradaCadastro = {
  nome: unknown;
  login: unknown;
  senha: unknown;
};

export class CadastrarUsuario {
  constructor(
    private usuarios: UsuarioRepositorio,
    private senhas: PasswordHasher
  ) {}

  async executar(entrada: EntradaCadastro) {

    const nome = typeof entrada.nome === 'string' ? entrada.nome.trim() : '';
    const login = typeof entrada.login === 'string' ? entrada.login.trim() : '';
    const senha = typeof entrada.senha === 'string' ? entrada.senha : '';

    if (!nome || nome.length > 100 || !login || login.length > 100 ||
      senha.length < 8 || senha.length > 128) {
      throw new CadastroInvalido();
    }

    return this.usuarios.criar({
      nome,
      login,
      senhaHash: this.senhas.hash(senha)
    });

  }
}

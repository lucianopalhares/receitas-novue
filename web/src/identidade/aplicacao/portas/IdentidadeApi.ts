import type { DadosCadastro, Sessao, Usuario } from '../../dominio/Usuario';

export interface IdentidadeApi {
  cadastrar(dados: DadosCadastro): Promise<Usuario>;
  entrar(login: string, senha: string): Promise<Sessao>;
  consultarUsuario(token: string): Promise<Usuario>;
    sair(token: string): Promise<void>;
}

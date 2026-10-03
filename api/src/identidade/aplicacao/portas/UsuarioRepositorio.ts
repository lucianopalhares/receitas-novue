import type { Usuario } from '../../dominio/Usuario';

export type NovoUsuario = {
  nome: string;
  login: string;
  senhaHash: string;
};

export type UsuarioComSenha ={
  usuario: Usuario;
  senhaHash: string;
};

export interface UsuarioRepositorio {
  criar (dados: NovoUsuario): Promise<Usuario>;
  buscarPorLogin(login: string): Promise<UsuarioComSenha | null>;
}

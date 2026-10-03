import type { DadosCadastro, Usuario } from '../dominio/Usuario';
import type { IdentidadeApi } from './portas/IdentidadeApi';

export class CadastrarUsuario {
  constructor(private api: IdentidadeApi) {}


  async executar(dados: DadosCadastro): Promise<Usuario> {
    const novoUsuario = await this.api.cadastrar(dados);
    return novoUsuario;
  }
}

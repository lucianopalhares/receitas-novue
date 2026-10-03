import { reactive } from 'vue';
import { CadastrarUsuario } from '../aplicacao/CadastrarUsuario';
import { ConsultarSessao } from '../aplicacao/ConsultarSessao';
import { EncerrarSessao } from '../aplicacao/EncerrarSessao';
import { IniciarSessao } from '../aplicacao/IniciarSessao';
import type { DadosCadastro, Usuario } from '../dominio/Usuario';
import { HttpIdentidadeApi } from '../infraestrutura/HttpIdentidadeApi';
import { LocalSessaoStore } from '../infraestrutura/LocalSessaoStore';

const api = new HttpIdentidadeApi();
const storage = new LocalSessaoStore();
const cadastrarUsuario = new CadastrarUsuario(api);
const iniciarSessao = new IniciarSessao(api, storage);
const consultarSessao = new ConsultarSessao(api, storage);
const encerrarSessao = new EncerrarSessao(api, storage);

// Estado compartilhado
export const identidade = reactive({
  usuario: null as Usuario | null,
  carregando: true
});

let restauracao: Promise<void> | null = null;

export async function restaurarSessao() {
  const tokenSalvo = storage.obterToken();
  if (!tokenSalvo) {
    identidade.carregando = false;
    return;
  }

  if (restauracao) return restauracao;

  restauracao = consultarSessao.executar()
    .then((usuario) => {
      identidade.usuario = usuario;
    })
    .finally(() => {
      identidade.carregando = false;
      restauracao = null;
    });

  return restauracao;
}

export async function cadastrar(dados: DadosCadastro) {
  const usuario = await cadastrarUsuario.executar(dados);
  return usuario;
}

export async function entrar(login: string, senha: string) {
  const sessao = await iniciarSessao.executar(login, senha);
  identidade.usuario = sessao.usuario;
}

export async function sair() {
   await encerrarSessao.executar();
   identidade.usuario = null;
}

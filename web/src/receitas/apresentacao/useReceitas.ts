import { reactive } from 'vue';
import { AtualizarReceita } from '../aplicacao/AtualizarReceita';
import { CadastrarReceita } from '../aplicacao/CadastrarReceita';
import { ConsultarReceita } from '../aplicacao/ConsultarReceita';
import { ExcluirReceita } from '../aplicacao/ExcluirReceita';
import { ListarReceitas } from '../aplicacao/ListarReceitas';
import { ListarCategorias } from '../aplicacao/ListarCategorias';
import type { CategoriaReceita, DadosReceita, Receita } from '../dominio/Receita';
import { HttpReceitaApi } from '../infraestrutura/HttpReceitaApi';
import { LocalSessaoStore } from '../../identidade/infraestrutura/LocalSessaoStore';


const api = new HttpReceitaApi(new LocalSessaoStore());

const listar = new ListarReceitas(api);

const listarCategorias = new ListarCategorias(api);


const consultar = new ConsultarReceita(api);

const cadastrar = new CadastrarReceita(api);

const atualizar = new AtualizarReceita(api);


const excluir = new ExcluirReceita(api);

export const estadoReceitas = reactive({
  itens: [] as Receita[],
  categorias: [] as CategoriaReceita[],
  carregando: false,
  carregandoCategorias: false,
  erro: '',
  erroCategorias: '',
  termo: ''
});

export async function carregarCategorias() {
  estadoReceitas.carregandoCategorias = true;
  estadoReceitas.erroCategorias = '';

    try {
    estadoReceitas.categorias = await listarCategorias.executar();
    } catch (err) {
    estadoReceitas.erroCategorias = err instanceof Error
      ? err.message
        : 'Não foi possível carregar as categorias.';
  } finally {
      estadoReceitas.carregandoCategorias = false;
  }
}

export async function carregarReceitas(termo = estadoReceitas.termo) {
    estadoReceitas.termo = termo;
    estadoReceitas.carregando = true;
    estadoReceitas.erro = '';

    try {
      estadoReceitas.itens = await listar.executar(termo);
  } catch (err) {
      estadoReceitas.erro = err instanceof Error ? err.message : 'Não foi possível carregar as receitas.';
    } finally {
    estadoReceitas.carregando = false;
    }
}


export function buscarReceita(id: number) {
  return consultar.executar(id);
}

function apareceNaBusca(receita: Receita) {
    const termo = estadoReceitas.termo.trim().toLowerCase();
    if (!termo) return true;

    return `${receita.nome || ''} ${receita.ingredientes || ''}`
      .toLowerCase().includes(termo);
}

export async function criarReceita(dados: DadosReceita) {
    const receita = await cadastrar.executar(dados);
  if (apareceNaBusca(receita)) estadoReceitas.itens.unshift(receita);
    return receita;
}

export async function atualizarReceita(id: number, dados: DadosReceita) {
  const receita = await atualizar.executar(id, dados);
  estadoReceitas.itens = estadoReceitas.itens.filter((item) => item.id !== id);
  if (apareceNaBusca(receita)) estadoReceitas.itens.unshift(receita);
  
return receita;
}

export async function excluirReceita(id: number) {
   await excluir.executar(id);
      estadoReceitas.itens = estadoReceitas.itens.filter((item) => item.id !== id);
}

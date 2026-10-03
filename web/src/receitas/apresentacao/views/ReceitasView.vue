<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type { DadosReceita, Receita } from '../../dominio/Receita';
import {
  atualizarReceita,
  buscarReceita,
  carregarCategorias,
   carregarReceitas,
  criarReceita,
  excluirReceita,
  estadoReceitas
} from '../useReceitas';


type FormularioReceita = {
  categoriaId: string | number;
  nome: string;
  tempoPreparoMinutos: string | number;
  porcoes: string | number;
  modoPreparo: string;
  ingredientes: string;
};


const filtro = ref('');

const modalAberto = ref(false);

const salvando = ref(false);
const avisoSucesso = ref('');


const editandoId = ref<number | null>(null);

const formulario = reactive<FormularioReceita>({
  categoriaId: '',
  nome: '',
  tempoPreparoMinutos: '',
  porcoes: '',
  modoPreparo: '',
   ingredientes: ''
});

onMounted(() => {
  carregarReceitas(filtro.value);
  carregarCategorias();
});


function limparFormulario() {
  editandoId.value = null;
  formulario.categoriaId = '';
  formulario.nome = '';
  formulario.tempoPreparoMinutos = '';
  formulario.porcoes = '';
  formulario.modoPreparo = '';
  formulario.ingredientes = '';
  estadoReceitas.erro = '';
}

function novaReceita() {
  limparFormulario();
  avisoSucesso.value = '';
  modalAberto.value = true;
}

async function editarReceita(receita: Receita) {
    avisoSucesso.value = '';
    estadoReceitas.erro = '';
  try {
      const dados = await buscarReceita(receita.id);
    
    editandoId.value = dados.id;
    formulario.categoriaId = dados.categoriaId?.toString() || '';
    formulario.nome = dados.nome || '';
    formulario.tempoPreparoMinutos = dados.tempoPreparoMinutos?.toString() || '';
    formulario.porcoes = dados.porcoes?.toString() || '';
    formulario.modoPreparo = dados.modoPreparo;
    formulario.ingredientes = dados.ingredientes || '';
      modalAberto.value = true;
  } catch (err) {
      estadoReceitas.erro = err instanceof Error ? err.message : 'Não foi possível abrir a receita.';
  }
}


function numeroOpcional(valor: string | number): number | null {
    return String(valor).trim() ? Number(valor) : null;
}

function dadosDoFormulario(): DadosReceita {
  return {
    categoriaId: numeroOpcional(formulario.categoriaId),
    nome: formulario.nome.trim() || null,
    tempoPreparoMinutos: numeroOpcional(formulario.tempoPreparoMinutos),
    porcoes: numeroOpcional(formulario.porcoes),
    modoPreparo: formulario.modoPreparo.trim(),
    ingredientes: formulario.ingredientes.trim() || null
  };
}


async function salvarReceita() {
  estadoReceitas.erro = '';
  avisoSucesso.value = '';
  salvando.value = true;
  try {
    const dados = dadosDoFormulario();
    if (editandoId.value) {
        await atualizarReceita(editandoId.value, dados);
        avisoSucesso.value = 'Receita atualizada com sucesso.';
    } else {
      await criarReceita(dados);
      avisoSucesso.value = 'Receita cadastrada com sucesso.';
      }
    modalAberto.value = false;
    } catch (err) {
    estadoReceitas.erro = err instanceof Error ? err.message : 'Não foi possível salvar a receita.';
  } finally {
    salvando.value = false;
  }
}


async function removerReceita(receita: Receita) {
  const nome = receita.nome || `receita #${receita.id}`;
  if (!window.confirm(`Excluir ${nome}? Esta ação não pode ser desfeita.`)) return;

  estadoReceitas.erro = '';
  avisoSucesso.value = '';
  try {
      await excluirReceita(receita.id);
      avisoSucesso.value = 'Receita excluída com sucesso.';
  } catch (err) {
      estadoReceitas.erro = err instanceof Error ? err.message : 'Não foi possível excluir a receita.';
  }
}


function dataCurta(valor: string) {
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? '—' : data.toLocaleDateString('pt-BR');
}

function escapar(texto: string) {
    const caracteres: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  };
  return texto.replace(/[&<>"']/g, (caractere) => caracteres[caractere]);

}


function imprimir(receita: Receita) {
  const janela = window.open('', '_blank', 'width=820,height=720');
    if (!janela) {
    estadoReceitas.erro = 'Permita a abertura da janela para imprimir.';
    return;
  }

  const nome = escapar(receita.nome || 'Receita sem nome');
  const ingredientes = escapar(receita.ingredientes || 'Não informado');
  const preparo = escapar(receita.modoPreparo);

  janela.document.write(`<!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <title>${nome}</title>
        <style>
          body { max-width: 720px; margin: 48px auto; padding: 0 24px; color: #263831; font: 16px Arial, sans-serif; }
          h1 { margin-bottom: 8px; font-size: 30px; }
          h2 { margin-top: 30px; font-size: 16px; }
          p { line-height: 1.65; white-space: pre-wrap; }
          .meta { color: #617068; font-size: 13px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <h1>${nome}</h1>
        <p class="meta">Preparo: ${receita.tempoPreparoMinutos ?? '—'} min · Porções: ${receita.porcoes ?? '—'}</p>
        <h2>Ingredientes</h2><p>${ingredientes}</p>
        <h2>Modo de preparo</h2><p>${preparo}</p>
      </body>
    </html>`);
    janela.document.close();
  janela.focus();
    window.setTimeout(() => janela.print(), 250);
}
</script>

<template>


      <section class="recipes-area">

      <div class="recipes-toolbar">
  <form class="recipe-search" @submit.prevent="carregarReceitas(filtro)">
    <label class="sr-only" for="busca-receitas">Pesquisar receitas</label>
      <input id="busca-receitas" v-model.trim="filtro" placeholder="Buscar por nome ou ingrediente" />
  <button class="button button-soft" type="submit">Buscar</button>
      </form>
      <button class="button button-primary recipe-add" type="button" @click="novaReceita">
  <span>+</span> Nova receita
    </button>
      </div>

    <p v-if="estadoReceitas.erro" class="notice notice-error recipe-error" role="alert">
      {{ estadoReceitas.erro }}
  </p>
    <p v-if="avisoSucesso" class="notice notice-success recipe-error" role="status">
      {{ avisoSucesso }}
    </p>

      <div class="recipe-table-wrap">

  <table class="recipe-table">
    <thead>
      <tr>
  <th>Receita</th>
    <th>Preparo</th>
      <th>Porções</th>
  <th>Alterada</th>
    <th><span class="sr-only">Ações</span></th>
      </tr>
  </thead>
    <tbody>
      <tr v-if="estadoReceitas.carregando">
  <td colspan="5" class="table-message">Carregando receitas…</td>
    </tr>
      <tr v-else-if="estadoReceitas.itens.length === 0">
  <td colspan="5" class="table-message">
              {{ filtro ? 'Nenhuma receita encontrada.' : 'Você ainda não cadastrou receitas.' }}
      </td>
  </tr>
    <template v-else>
      <tr v-for="receita in estadoReceitas.itens" :key="receita.id">
  <td>
    <strong>{{ receita.nome || 'Receita sem nome' }}</strong>
      <small>{{ receita.categoriaNome || (receita.categoriaId ? `Categoria ${receita.categoriaId}` : 'Sem categoria') }}</small>
  </td>
    <td>{{ receita.tempoPreparoMinutos ?? '—' }} min</td>
      <td>{{ receita.porcoes ?? '—' }}</td>
  <td>{{ dataCurta(receita.alteradoEm) }}</td>
    <td>
      <div class="recipe-actions">
  <button type="button" @click="editarReceita(receita)">Editar</button>
    <button type="button" @click="imprimir(receita)">Imprimir</button>
      <button class="action-delete" type="button" @click="removerReceita(receita)">Excluir</button>
  </div>
    </td>
      </tr>
          </template>
    </tbody>
      </table>
  </div>
    </section>

  <div v-if="modalAberto" class="modal-backdrop" @click.self="modalAberto = false">
    <section class="recipe-dialog" role="dialog" aria-modal="true" aria-labelledby="recipe-dialog-title">
      <header class="dialog-heading">
  <div>
    <span class="eyebrow">CADASTRO</span>
      <h2 id="recipe-dialog-title">{{ editandoId ? 'Editar receita' : 'Nova receita' }}</h2>
  </div>
    <button class="dialog-close" type="button" aria-label="Fechar" @click="modalAberto = false">×</button>
      </header>

    <form class="recipe-form" @submit.prevent="salvarReceita">
      <div class="recipe-form-grid">
  <label class="field recipe-name-field">
    <span>Nome da receita <small>opcional</small></span>
      <input v-model.trim="formulario.nome" maxlength="45" placeholder="Ex.: Sopa de legumes" />
  </label>
          <label class="field">
            <span>Categoria <small>opcional</small></span>
            <select v-model="formulario.categoriaId">
              <option value="">Sem categoria</option>
              <option
                v-for="categoria in estadoReceitas.categorias"
                :key="categoria.id"
                :value="String(categoria.id)"
              >
                {{ categoria.nome || ('Categoria ' + categoria.id) }}
              </option>
            </select>
            <small v-if="estadoReceitas.carregandoCategorias">Carregando categorias…</small>
            <small v-else-if="estadoReceitas.erroCategorias">{{ estadoReceitas.erroCategorias }}</small>
    </label>
      <label class="field">
  <span>Tempo de preparo (min)</span>
    <input v-model="formulario.tempoPreparoMinutos" type="number" min="0" max="4294967295" step="1" />
      </label>
  <label class="field">
    <span>Porções</span>
      <input v-model="formulario.porcoes" type="number" min="0" max="4294967295" step="1" />
  </label>
    </div>

  <label class="field">
    <span>Ingredientes <small>opcional</small></span>
      <textarea v-model.trim="formulario.ingredientes" rows="3" placeholder="Liste os ingredientes"></textarea>
  </label>
    <label class="field">
      <span>Modo de preparo</span>
  <textarea v-model.trim="formulario.modoPreparo" rows="5" required placeholder="Descreva como preparar"></textarea>
    </label>

  <p v-if="estadoReceitas.erro" class="notice notice-error" role="alert">
          {{ estadoReceitas.erro }}
      </p>
  <footer class="dialog-actions">
    <button class="button button-soft" type="button" @click="modalAberto = false">Cancelar</button>
      <button class="button button-primary" type="submit" :disabled="salvando">
            {{ salvando ? 'Salvando…' : 'Salvar receita' }}
    </button>
      </footer>
  </form>
    </section>
      </div>



</template>

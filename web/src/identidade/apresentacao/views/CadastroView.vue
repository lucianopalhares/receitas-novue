<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthLayout from '../layout/AuthLayout.vue';
import { cadastrar } from '../useIdentidade';

const router = useRouter();
const nome = ref('');
const login = ref('');
const senha = ref('');
const erro = ref('');
const enviando = ref(false);

async function criarConta() {
  erro.value = '';
  enviando.value = true;

  try {
    const dados = {
      nome: nome.value,
      login: login.value,
      senha: senha.value
    };
    await cadastrar(dados);
    await router.push({ name: 'login', query: { cadastro: 'ok' } });
  } catch (err) {
    erro.value = err instanceof Error ? err.message : 'Não foi possível criar a conta.';
  } finally {
    enviando.value = false;
  }
}
</script>

<template>
    <AuthLayout
      titulo="Crie sua conta"
      descricao="Preencha os dados abaixo para começar."
      linkTexto="Já tem uma conta?"
        linkLabel="Entrar"
      linkDestino="/login"
    >

      <form class="auth-form" @submit.prevent="criarConta">
       <label class="field">
          <span>Nome</span>
        <input v-model.trim="nome" autocomplete="name" maxlength="100"
          required placeholder="Como podemos chamar você?" />
      </label>


      <label class="field">
        <span>Usuário</span>
        <input v-model.trim="login" autocomplete="username" maxlength="100"
          required placeholder="Escolha um login" />
      </label>

      <label class="field">
        <span>Senha</span>
        <input v-model="senha" type="password" autocomplete="new-password"
          minlength="8" maxlength="128" required placeholder="Pelo menos 8 caracteres" />
      </label>

      <p v-if="erro" class="notice notice-error" role="alert">{{ erro }}</p>

      <button class="button button-primary" type="submit" :disabled="enviando">
          {{ enviando ? 'Criando conta…' : 'Criar conta' }}
        <span aria-hidden="true">→</span>
      </button>

      </form>

    </AuthLayout>
</template>

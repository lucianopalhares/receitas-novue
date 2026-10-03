<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthLayout from '../layout/AuthLayout.vue';
import { entrar } from '../useIdentidade';

const route = useRoute();
const router = useRouter();
const login = ref('');
const senha = ref('');
const erro = ref('');
const enviando = ref(false);
const cadastroOk = computed(() => route.query.cadastro === 'ok');

async function fazerLogin() {
  erro.value = '';
  enviando.value = true;

  try {
    await entrar(login.value, senha.value);
    await router.push({ name: 'dashboard' });
  } catch (err) {
    erro.value = err instanceof Error ? err.message : 'Não foi possível entrar.';
  } finally {
    enviando.value = false;
  }
}
</script>

<template>
    <AuthLayout
      titulo="Acesse sua conta"
      descricao="Informe seus dados para continuar."
        linkTexto="Ainda não tem uma conta?"
      linkLabel="Criar conta"
      linkDestino="/cadastro"
    >

    <div v-if="cadastroOk" class="notice notice-success" role="status">
        Cadastro concluído. Agora você já pode entrar.
    </div>


    <form class="auth-form" @submit.prevent="fazerLogin">
      <label class="field">
        <span>Usuário</span>
        <input v-model.trim="login" autocomplete="username" maxlength="100"
          required placeholder="Seu login" />
      </label>


      <label class="field">
        <span>Senha</span>
        <input v-model="senha" type="password" autocomplete="current-password"
          required placeholder="Sua senha" />
      </label>

      <p v-if="erro" class="notice notice-error" role="alert">{{ erro }}</p>

      <button class="button button-primary" type="submit" :disabled="enviando">
        {{ enviando ? 'Entrando…' : 'Entrar' }}
          <span aria-hidden="true">→</span>
      </button>

    </form>

    </AuthLayout>
</template>

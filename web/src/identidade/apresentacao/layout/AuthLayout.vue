<script setup lang="ts">
defineProps<{
  titulo: string;
  descricao: string;
  linkTexto: string;
  linkLabel: string;
  linkDestino: string;
}>();
</script>

<template>
    <main class="auth-page">

          <section class="auth-intro">
        <RouterLink class="brand brand-light" to="/login" aria-label="Receitas, início">
          <span class="brand-mark">R</span>
          <span>receitas<span class="brand-dot">.</span></span>
        </RouterLink>

        <div class="intro-copy">
        <span class="eyebrow eyebrow-light">PAINEL ADMINISTRATIVO</span>
        <h1>Seu trabalho,<br />
          em um só lugar.</h1>
        <p>
          Entre para acessar seu espaço de gestão e acompanhar tudo
          com tranquilidade.
        </p>

        </div>

        <div class="intro-foot">
          <span class="intro-line"></span>
          <span>Organize seu espaço no seu ritmo.</span>
        </div>

        <div class="intro-shape" aria-hidden="true"></div>
          </section>

          <section class="auth-main">
        <div class="auth-card">
          <span class="eyebrow">BEM-VINDO</span>
        <h2>{{ titulo }}</h2>
        <p class="auth-description">
          {{ descricao }}
        </p>
        <slot />

        <p class="auth-switch">
          {{ linkTexto }}
          <RouterLink :to="linkDestino">{{ linkLabel }}</RouterLink>
        </p>
        </div>

        <span class="auth-copyright">Receitas · Área segura</span>
          </section>

    </main>
</template>

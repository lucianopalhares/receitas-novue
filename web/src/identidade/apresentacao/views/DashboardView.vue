<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { identidade, sair } from '../useIdentidade';

const router = useRouter();
const nome = computed(() => {
  return identidade.usuario?.nome?.split(' ')[0] || 'Admin';
});
const iniciais = computed(() => identidade.usuario?.nome
  ?.split(' ')
  .slice(0, 2).map((parte) => parte[0])
  .join('').toUpperCase() || 'AD');

async function fazerLogout() {
  await sair();
  await router.replace({ name: 'login' });
}
</script>

<template>
    <div class="dashboard-shell">

        <aside class="sidebar">
      <RouterLink class="brand" to="/dashboard">
        <span class="brand-mark">R</span>
          <span>receitas<span class="brand-dot">.</span></span>
      </RouterLink>

      <div class="sidebar-caption">ESPAÇO DE TRABALHO</div>

      <RouterLink class="side-link side-link-active" to="/dashboard">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
        </svg>
          Visão geral
      </RouterLink>
        <!-- A navegação pode ganhar outros modulos mais pra frente. -->
      <div class="sidebar-bottom">
        <div class="help-card">
          <span class="help-dot"></span>
          <div><strong>Seu painel</strong><small>Espaço pessoal</small></div>
        </div>
        <button
          class="side-link logout-link"
          type="button"
          @click="fazerLogout"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/></svg>
          Sair da conta
        </button>
      </div>

        </aside>

        <main class="dashboard-main">
      <header class="topbar">
        <span class="topbar-label">PAINEL ADMINISTRATIVO</span>

        <div class="user-menu">
          <div class="user-copy">
            <strong>{{ identidade.usuario?.nome }}</strong>
            <span>{{ identidade.usuario?.login }}</span>
          </div>
            <span class="avatar">{{ iniciais }}</span>
        </div>
      </header>

      <section class="dashboard-content">
        <div class="page-heading">
          <div>
            <span class="eyebrow">VISÃO GERAL</span>
            <h1>Olá, {{ nome }} <span class="heading-wave">•</span></h1>
            <p>Este é o seu espaço de trabalho.</p>
          </div>
          <span class="date-chip">Área administrativa</span>
        </div>

        <section class="empty-panel" aria-labelledby="empty-title">

          <div class="empty-illustration" aria-hidden="true">
            <div class="illustration-back"></div>
            <div class="illustration-card">
              <span></span><span></span><span></span>
              <div class="illustration-chart"><i></i><i></i><i></i><i></i></div>
            </div>
            <div class="illustration-spark spark-one">+</div>
            <div class="illustration-spark spark-two">+</div>
          </div>
          <span class="eyebrow">TUDO PRONTO</span>
          <h2 id="empty-title">Seu painel começa aqui</h2>
          <p>Este espaço está preparado para receber novas áreas de gestão quando você precisar.</p>
        </section>
      </section>

        </main>
    </div>
</template>

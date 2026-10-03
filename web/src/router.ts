import { createRouter, createWebHistory } from 'vue-router';
import { identidade, restaurarSessao } from './identidade/apresentacao/useIdentidade';
import CadastroView from './identidade/apresentacao/views/CadastroView.vue';
import DashboardView from './identidade/apresentacao/views/DashboardView.vue';
import LoginView from './identidade/apresentacao/views/LoginView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: { name: 'dashboard' } },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/cadastro', name: 'cadastro', component: CadastroView },
    { path: '/dashboard', name: 'dashboard', component: DashboardView }
  ]
});

router.beforeEach(async (to) => {
    await restaurarSessao();
    const conectado = Boolean( identidade.usuario );

    if (to.name === 'dashboard' && !conectado) {
      return { name: 'login' };
    }

    if ((to.name === 'login' || to.name === 'cadastro') && conectado) {
      return { name: 'dashboard' };
    }
});

export default router;

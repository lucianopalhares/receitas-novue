import type { SessaoStore } from '../aplicacao/portas/SessaoStore';

const TOKEN_KEY = 'receitas-admin-token';

export class LocalSessaoStore implements SessaoStore {

  obterToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  salvarToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  limpar() {
    localStorage.removeItem(TOKEN_KEY);
  }
}

import type { IdentidadeApi } from '../aplicacao/portas/IdentidadeApi';
import type { DadosCadastro, Sessao, Usuario } from '../dominio/Usuario';

export class HttpIdentidadeApi implements IdentidadeApi {
  private baseUrl = import.meta.env.VITE_API_URL || '';

  private async pedir<T>(url: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers);

    if (options.body) headers.set('Content-Type', 'application/json');

    const response = await fetch(`${this.baseUrl}${url}`, { ...options, headers });
    if (response.status === 204) {
      return undefined as T;
    }

    const body = await response.json().catch(() => null);
    const deuCerto = response.ok;
    if (!deuCerto) {
      throw new Error(body?.erro || 'Não foi possível concluir a solicitacao.');
    }

    return body as T;
  }

  cadastrar(dados: DadosCadastro): Promise<Usuario> {
    return this.pedir('/usuarios', {
      method: 'POST',
      body: JSON.stringify(dados)
    });
  }

  entrar(login: string, senha: string): Promise<Sessao> {
    return this.pedir('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        login,
        senha
      })
    });
  }

  consultarUsuario(token: string): Promise<Usuario> {
    return this.pedir('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  sair(token: string): Promise<void> {
    return this.pedir('/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}

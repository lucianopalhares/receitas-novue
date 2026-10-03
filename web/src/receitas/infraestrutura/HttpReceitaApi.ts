import type { ReceitaApi } from '../aplicacao/portas/ReceitaApi';
import type { CategoriaReceita, DadosReceita, Receita } from '../dominio/Receita';
import type { SessaoStore } from '../../identidade/aplicacao/portas/SessaoStore';

export class HttpReceitaApi implements ReceitaApi {
  private baseUrl = import.meta.env.VITE_API_URL || '';

  constructor(private sessoes: SessaoStore) {}

  private async pedir<T>(url: string, options: RequestInit = {}): Promise<T> {
      const token = this.sessoes.obterToken();
      if (!token) throw new Error('Sua sessão expirou. Entre novamente.');

      const headers = new Headers(options.headers);
      headers.set('Authorization', `Bearer ${token}`);
      if (options.body) headers.set('Content-Type', 'application/json');

      const response = await fetch(`${this.baseUrl}${url}`, { ...options, headers });
      if (response.status === 204) return undefined as T;

      const body = await response.json().catch(() => null);
    
    if (!response.ok) {
      throw new Error(body?.erro || 'Não foi possível concluir a operação.');
        }

      return body as T;
    }

    listarCategorias(): Promise<CategoriaReceita[]> {
      return this.pedir('/categorias');
    }

    listar(termo?: string): Promise<Receita[]> {
      const query = termo?.trim() ? `?q=${encodeURIComponent(termo.trim())}` : '';
      return this.pedir(`/receitas${query}`);
    }

    consultar(id: number): Promise<Receita> {
      return this.pedir(`/receitas/${id}`);
    }

    cadastrar(dados: DadosReceita): Promise<Receita> {
        return this.pedir('/receitas', {
          method: 'POST',
        body: JSON.stringify(dados)
          });
    }

    atualizar(id: number, dados: DadosReceita): Promise<Receita> {
      return this.pedir(`/receitas/${id}`, {
          method: 'PUT',
          body: JSON.stringify(dados)
      });
    }

    excluir(id: number): Promise<void> {
      return this.pedir(`/receitas/${id}`, { method: 'DELETE' });
    }
}

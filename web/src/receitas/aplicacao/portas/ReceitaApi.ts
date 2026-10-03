import type { CategoriaReceita, DadosReceita, Receita } from '../../dominio/Receita';

export interface ReceitaApi {
    listarCategorias(): Promise<CategoriaReceita[]>;
  listar(termo?: string): Promise<Receita[]>;
    consultar(id: number): Promise<Receita>;
    cadastrar(dados: DadosReceita): Promise<Receita>;
  atualizar(id: number, dados: DadosReceita): Promise<Receita>;
    excluir(id: number): Promise<void>;
}

import type { Receita } from '../../dominio/Receita';

export type DadosReceita ={
  categoriaId: number | null;
  nome: string | null;
  tempoPreparoMinutos: number | null;
  porcoes: number | null;
  modoPreparo: string;
  ingredientes: string | null;
};


export interface ReceitaRepositorio {
  criar(usuarioId: number, dados: DadosReceita): Promise<Receita>;
  listar(usuarioId: number, termo?: string): Promise<Receita[]>;
  buscarPorId(usuarioId: number, id: number): Promise<Receita | null>;
  atualizar(usuarioId: number, id: number, dados: DadosReceita): Promise<Receita | null>;
  remover(usuarioId: number, id: number): Promise<boolean>;
}

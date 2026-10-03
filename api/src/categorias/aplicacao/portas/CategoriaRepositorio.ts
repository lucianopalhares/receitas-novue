import type { Categoria } from '../../dominio/Categoria';

export interface CategoriaRepositorio {
    listar(): Promise<Categoria[]>;
}

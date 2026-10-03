import type { Pool, RowDataPacket } from 'mysql2/promise';
import type { CategoriaRepositorio } from '../aplicacao/portas/CategoriaRepositorio';


interface CategoriaRow extends RowDataPacket {
  id: number;
  nome: string | null;
}

// Consulta as categorias ja cadastradas
export class MySqlCategoriaRepositorio implements CategoriaRepositorio {
  constructor(private db: Pool) {}

    async listar() {
    const [rows] = await this.db.execute<CategoriaRow[]>(
        'SELECT id, nome FROM categorias ORDER BY nome ASC, id ASC'
    );

      return rows.map((row) => ({ id: row.id, nome: row.nome }));
  }
}

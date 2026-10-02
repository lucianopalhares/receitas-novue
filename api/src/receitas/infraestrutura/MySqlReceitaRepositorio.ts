import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import type { DadosReceita, ReceitaRepositorio } from '../aplicacao/portas/ReceitaRepositorio';
import { Receita } from '../dominio/Receita';

interface ReceitaRow extends RowDataPacket {
  id: number;
  categoria_id: number | null;
  categoria_nome: string | null;
  nome: string | null;
  tempo_preparo_minutos: number | null;
  porcoes: number | null;
  modo_preparo: string;
  ingredientes: string | null;
  criado_em: Date | string;
  alterado_em: Date | string;
}

const CAMPOS_RECEITA = 'r.id, r.id_categorias AS categoria_id, c.nome AS categoria_nome, r.nome, r.tempo_preparo_minutos, r.porcoes, r.modo_preparo, r.ingredientes, r.criado_em, r.alterado_em';

function dataDoBanco(valor: Date | string) {
  return valor instanceof Date ? valor : new Date(valor);
}

export class MySqlReceitaRepositorio implements ReceitaRepositorio {
  constructor(private db: Pool) {}

  // filtro de usuario fica aqui, e de onde sai o dono certo
  private mapear(row: ReceitaRow) {

    return new Receita(
      row.id,
      row.categoria_id,
      row.categoria_nome,
      row.nome,
      row.tempo_preparo_minutos,
      row.porcoes,
      row.modo_preparo,
      row.ingredientes,
      dataDoBanco(row.criado_em),
      dataDoBanco(row.alterado_em)
    );

  }

  async criar(usuarioId: number, dados: DadosReceita) {
    const [result] = await this.db.execute<ResultSetHeader>(
      'INSERT INTO receitas (id_usuarios, id_categorias, nome, tempo_preparo_minutos, porcoes, modo_preparo, ingredientes, criado_em, alterado_em) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [usuarioId, dados.categoriaId, dados.nome, dados.tempoPreparoMinutos,
        dados.porcoes, dados.modoPreparo, dados.ingredientes]
    );

    const receita = await this.buscarPorId(usuarioId, result.insertId);

    if (!receita) throw new Error('Receita nao encontrada apos cadastro.');

    return receita;
  }

  async listar(usuarioId: number, termo?: string) {

    const valores: Array<string | number> = [usuarioId];

    let filtro = '';

    if (termo) {
      filtro = ' AND (r.nome LIKE ? OR r.ingredientes LIKE ?)';
      valores.push('%' + termo + '%', '%' + termo + '%');
    }

    const [rows] = await this.db.execute<ReceitaRow[]>(
      'SELECT ' + CAMPOS_RECEITA + ' FROM receitas r LEFT JOIN categorias c ON c.id = r.id_categorias WHERE r.id_usuarios = ?' + filtro + ' ORDER BY r.alterado_em DESC, r.id DESC',
      valores
    );

    return rows.map((row) => this.mapear(row));

  }

  async buscarPorId(usuarioId: number, id: number) {

    const [rows] = await this.db.execute<ReceitaRow[]>(
      'SELECT ' + CAMPOS_RECEITA + ' FROM receitas r LEFT JOIN categorias c ON c.id = r.id_categorias WHERE r.id = ? AND r.id_usuarios = ? LIMIT 1',
      [id, usuarioId]
    );

    return rows[0] ? this.mapear(rows[0]) : null;
  }

  async atualizar(usuarioId: number, id: number, dados: DadosReceita) {

    await this.db.execute(
      'UPDATE receitas SET id_categorias = ?, nome = ?, tempo_preparo_minutos = ?, porcoes = ?, modo_preparo = ?, ingredientes = ?, alterado_em = NOW() WHERE id = ? AND id_usuarios = ?',
      [dados.categoriaId, dados.nome, dados.tempoPreparoMinutos, dados.porcoes,
        dados.modoPreparo, dados.ingredientes, id, usuarioId]
    );

    return this.buscarPorId(usuarioId, id);

  }

  async remover(usuarioId: number, id: number) {

    const [result] = await this.db.execute<ResultSetHeader>(
      'DELETE FROM receitas WHERE id = ? AND id_usuarios = ?',
      [id, usuarioId]
    );
    return result.affectedRows > 0;

  }
}

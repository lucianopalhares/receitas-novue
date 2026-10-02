import type { Pool, RowDataPacket } from 'mysql2/promise';
import type { SessaoRepositorio } from '../aplicacao/portas/SessaoRepositorio';
import { Sessao } from '../dominio/Sessao';
import { Usuario } from '../dominio/Usuario';

interface SessaoUsuarioRow extends RowDataPacket {
  usuario_id: number;
  token_hash: string;
  expira_em: Date;
  id: number;
  nome: string | null;
  login: string;
}

export class MySqlSessaoRepositorio implements SessaoRepositorio {
  constructor(private db: Pool) {}

  async criar(sessao: Sessao) {
      await this.db.execute(
        'INSERT INTO sessoes_usuario (id_usuarios, token_hash, criado_em, expira_em) VALUES (?, ?, NOW(), ?)',
        [sessao.usuarioId, sessao.tokenHash, sessao.expiraEm]
      );
  }

  async buscarPorTokenHash(tokenHash: string) {
    const [rows] = await this.db.execute<SessaoUsuarioRow[]>(
      'SELECT s.id_usuarios AS usuario_id, s.token_hash, s.expira_em, u.id, u.nome, u.login FROM sessoes_usuario s INNER JOIN usuarios u ON u.id = s.id_usuarios WHERE s.token_hash = ? LIMIT 1',
      [tokenHash]
    );

    const row = rows[0];

    if (!row) return null;

    return {
       sessao: new Sessao(row.usuario_id, row.token_hash, new Date(row.expira_em)),
       usuario: new Usuario(row.id, row.nome, row.login)
    };
  }

  async removerPorTokenHash(tokenHash: string) {
    await this.db.execute(
      'DELETE FROM sessoes_usuario WHERE token_hash = ?',
      [tokenHash]
    );
  }
}

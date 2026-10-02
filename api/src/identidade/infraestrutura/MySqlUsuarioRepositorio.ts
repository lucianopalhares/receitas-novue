import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { LoginJaCadastrado } from '../aplicacao/erros';
import type { NovoUsuario, UsuarioComSenha, UsuarioRepositorio } from '../aplicacao/portas/UsuarioRepositorio';
import { Usuario } from '../dominio/Usuario';

interface UsuarioRow extends RowDataPacket {
  id: number;
  nome: string | null;
  login: string;
  senha: string;
}

export class MySqlUsuarioRepositorio implements UsuarioRepositorio {
  constructor(private db: Pool) {}

  async criar(dados: NovoUsuario) {

    try {
      const [result] = await this.db.execute<ResultSetHeader>(
        'INSERT INTO usuarios (nome, login, senha, criado_em, alterado_em) VALUES (?, ?, ?, NOW(), NOW())',
        [dados.nome, dados.login, dados.senhaHash]
      );

      return new Usuario(result.insertId, dados.nome, dados.login);
    } catch (err) {
      if ((err as { code?: string }).code === 'ER_DUP_ENTRY') {
        throw new LoginJaCadastrado();
      }

      throw err;
    }

  }

  async buscarPorLogin(login: string): Promise<UsuarioComSenha | null> {

    const [rows] = await this.db.execute<UsuarioRow[]>(
      'SELECT id, nome, login, senha FROM usuarios WHERE login = ? LIMIT 1',
      [login]
    );

    const row = rows[0];
    if (!row) return null;

    return {
      usuario: new Usuario(row.id, row.nome, row.login),
      senhaHash: row.senha
    };

  }
}

import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { Router } from 'express';
import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

interface Usuario extends RowDataPacket {
  id: number;
  nome: string | null;
  login: string;
  senha: string;
}

function hashSenha(senha: string) {
  const salt = randomBytes(16).toString('base64url');
  const hash = scryptSync(senha, salt, 48).toString('base64url');

   return salt + '.' + hash;
}

function confereSenha(senha: string, salvo: string) {
  const [salt, hash] = salvo.split('.');
  if (!salt || !hash) return false;

  const esperado = Buffer.from(hash, 'base64url');
  const atual = scryptSync(senha, salt, 48);
  if (esperado.length !== atual.length) return false;

  return timingSafeEqual(esperado, atual);
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function authRoutes(db: Pool) {
  const router = Router();

  router.post('/usuarios', async (req, res) => {
    const nome = typeof req.body?.nome === 'string' ? req.body.nome.trim() : '';
    const login = typeof req.body?.login === 'string' ? req.body.login.trim() : '';
    const senha = typeof req.body?.senha === 'string' ? req.body.senha : '';


    if (!nome || nome.length > 100 || !login || login.length > 100 ||
       senha.length < 8 || senha.length > 128) {
      return res.status(400).json({ erro: 'Dados de cadastro inválidos.' });
    }

    try {
      const [result] = await db.execute<ResultSetHeader>(
        'INSERT INTO usuarios (nome, login, senha, criado_em, alterado_em) VALUES (?, ?, ?, NOW(), NOW())',
        [nome, login, hashSenha(senha)]
      );

      return res.status(201).json({ id: result.insertId, nome, login });
    } catch (err) {
      if ((err as { code?: string }).code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ erro: 'Login já cadastrado.' });
      }

      console.error(err);
      return res.status(500).json({ erro: 'Não foi possível cadastrar o usuário.' });
    }
  });

  router.post('/auth/login', async (req, res) => {
    const login = typeof req.body?.login === 'string' ? req.body.login.trim() : '';
    const senha = typeof req.body?.senha === 'string' ? req.body.senha : '';

    if (!login || !senha) {
      return res.status(400).json({ erro: 'Informe login e senha.' });
    }

    try {

      const [rows] = await db.execute<Usuario[]>(
        'SELECT id, nome, login, senha FROM usuarios WHERE login = ? LIMIT 1',
        [login]
      );
      const usuario = rows[0];

      if (!usuario || !confereSenha(senha, usuario.senha)) {
        return res.status(401).json({ erro: 'Login ou senha inválidos.' });
      }

      const token = randomBytes(32).toString('base64url');
      const expiraEm = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await db.execute(
        'INSERT INTO sessoes_usuario (id_usuarios, token_hash, criado_em, expira_em) VALUES (?, ?, NOW(), ?)',
        [usuario.id, hashToken(token), expiraEm]
      );

      return res.json({
        token,
        usuario: { id: usuario.id, nome: usuario.nome, login: usuario.login }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Não foi possível iniciar a sessão.' });
    }

  });

  router.post('/auth/logout', async (req, res) => {
    const header = req.get('authorization') || '';
    const match = header.match(/^Bearer\s+(.+)$/i);

    if (!match) {
      return res.status(401).json({ erro: 'Token de sessão obrigatório.' });
    }

    try {
      // apaga a sessao atual
      await db.execute(
        'DELETE FROM sessoes_usuario WHERE token_hash = ?',
        [hashToken(match[1])]
      );
      return res.status(204).end();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Não foi possível encerrar a sessão.' });
    }
  });

  return router;
}

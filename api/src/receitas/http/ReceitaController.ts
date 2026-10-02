import type { Request, Response } from 'express';
import type { ConsultarSessaoAtual } from '../../identidade/aplicacao/ConsultarSessaoAtual';
import {
  SessaoInvalida,
  TokenSessaoObrigatorio
} from '../../identidade/aplicacao/erros';
import type { AtualizarReceita } from '../aplicacao/AtualizarReceita';
import type { CadastrarReceita } from '../aplicacao/CadastrarReceita';
import type { ConsultarReceita } from '../aplicacao/ConsultarReceita';
import type { ExcluirReceita } from '../aplicacao/ExcluirReceita';
import type { ListarReceitas } from '../aplicacao/ListarReceitas';
import { ReceitaInvalida } from '../aplicacao/erros';

function tokenDo(req: Request) {
  const header = req.get('authorization') || '';

  const match = header.match(/^Bearer\s+(.+)$/i);

  return match ? match[1] : null;
}

function idDaRota(req: Request) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export class ReceitaController {
  constructor(
    private consultarSessao: ConsultarSessaoAtual,
    private casos: {
      cadastrar: CadastrarReceita;
      listar: ListarReceitas;
      consultar: ConsultarReceita;
      atualizar: AtualizarReceita;
      excluir: ExcluirReceita;
    }
  ) {

  }

  // autenticacao é checada sempre
  private async usuarioId(req: Request, res: Response): Promise<number | null> {
    try {

      const usuario = await this.consultarSessao.executar(tokenDo(req));
      return usuario.id;
    } catch (err) {

      if (err instanceof TokenSessaoObrigatorio || err instanceof SessaoInvalida) {
        res.status(401).json({ erro: 'Sessão inválida ou expirada.' });
        return null;
      }

      console.error(err);
      res.status(500).json({ erro: 'Não foi possivel validar a sessao' });
      return null;

    }
  }

  listar = async (req: Request, res: Response) => {

    const usuarioId = await this.usuarioId(req, res);
    if (usuarioId === null) return;


    try {

      const termo = typeof req.query.q === 'string' ? req.query.q : undefined;
      return res.json(await this.casos.listar.executar(usuarioId, termo));

    } catch (err) {

      console.error(err);
      return res.status(500).json({ erro: 'Não foi possível listar as receitas.' });

    }

  };

  consultar = async (req: Request, res: Response) => {

    const usuarioId = await this.usuarioId(req, res);

    if (usuarioId === null) return;
    const id = idDaRota(req);

    if (id === null) return res.status(400).json({ erro: 'Id de receita inválido.' });

    try {
      const receita = await this.casos.consultar.executar(usuarioId, id);
      if (!receita) return res.status(404).json({ erro: 'Receita não encontrada.' });
      return res.json(receita);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Não foi possível consultar a receita.' });
    }

  };

  cadastrar = async (req: Request, res: Response) => {

    const usuarioId = await this.usuarioId(req, res);
    if (usuarioId === null) return;

    try {
      const receita = await this.casos.cadastrar.executar(usuarioId, req.body);
      return res.status(201).json(receita);
    } catch (err) {
      if (err instanceof ReceitaInvalida) {
        return res.status(400).json({ erro: 'Dados da receita inválidos.' });
      }

      console.error(err);
      return res.status(500).json({ erro: 'Não foi possível cadastrar a receita.' });
    }

  };

  atualizar = async (req: Request, res: Response) => {

    const usuarioId = await this.usuarioId(req, res);
    if (usuarioId === null) return;

    const id = idDaRota(req);

    if (id === null) return res.status(400).json({ erro: 'Id de receita inválido.' });


    try {

      const receita = await this.casos.atualizar.executar(usuarioId, id, req.body);
      if (!receita) return res.status(404).json({ erro: 'Receita não encontrada.' });
      return res.json(receita);

    } catch (err) {

      if (err instanceof ReceitaInvalida) {
        return res.status(400).json({ erro: 'Dados da receita inválidos.' });
      }

      console.error(err);
      return res.status(500).json({ erro: 'Não foi possível atualizar a receita.' });

    }
  };

  excluir = async (req: Request, res: Response) => {

    const usuarioId = await this.usuarioId(req, res);
    if (usuarioId === null) return;

    const id = idDaRota(req);

    if (id === null) return res.status(400).json({ erro: 'Id de receita inválido.' });

    try {

      const removida = await this.casos.excluir.executar(usuarioId, id);
      if (!removida) return res.status(404).json({ erro: 'Receita não encontrada.' });

      return res.status(204).end();

    } catch (err) {

      console.error(err);
      return res.status(500).json({ erro: 'Não foi possível excluir a receita.' });

    }

  };
}

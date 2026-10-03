import type { Request, Response } from 'express';
import type { ConsultarSessaoAtual } from '../../identidade/aplicacao/ConsultarSessaoAtual';
import {
    SessaoInvalida,
  TokenSessaoObrigatorio
} from '../../identidade/aplicacao/erros';
import type { ListarCategorias } from '../aplicacao/ListarCategorias';

function tokenDo(req: Request) {
  const header = req.get('authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
    return match ? match[1] : null;
}

export class CategoriaController {
  constructor(
      private consultarSessao: ConsultarSessaoAtual,
    private listarCategorias: ListarCategorias
    ) {}

  listar = async (req: Request, res: Response) => {
      try {
      await this.consultarSessao.executar(tokenDo(req));
        return res.json(await this.listarCategorias.executar());
    } catch (err) {
      if (err instanceof TokenSessaoObrigatorio || err instanceof SessaoInvalida) {
          return res.status(401).json({ erro: 'Sessão inválida ou expirada.' });
      }

      console.error(err);
      return res.status(500).json({ erro: 'Não foi possível listar as categorias.' });
      }
  };
}

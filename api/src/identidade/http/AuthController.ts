import type { Request, Response } from 'express';
import type { CadastrarUsuario } from '../aplicacao/CadastrarUsuario';
import type { ConsultarSessaoAtual } from '../aplicacao/ConsultarSessaoAtual';
import type { EncerrarSessao } from '../aplicacao/EncerrarSessao';
import type { IniciarSessao } from '../aplicacao/IniciarSessao';
import {
  CadastroInvalido,
  CredenciaisInvalidas,
  DadosLoginInvalidos,
  LoginJaCadastrado,
  SessaoInvalida,
  TokenSessaoObrigatorio
} from '../aplicacao/erros';

type CasosIdentidade = {
  cadastrarUsuario: CadastrarUsuario;
  iniciarSessao: IniciarSessao;
  consultarSessao: ConsultarSessaoAtual;
  encerrarSessao: EncerrarSessao;
};

function tokenDo(req: Request) {
  const header = req.get('authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

export class AuthController {

  constructor(private casos: CasosIdentidade) {}

  cadastrar = async (req: Request, res: Response) => {
    try {

      const usuario = await this.casos.cadastrarUsuario.executar({
        nome: req.body?.nome,
        login: req.body?.login,
        senha: req.body?.senha
      });

      return res.status(201).json({
        id: usuario.id,
        nome: usuario.nome,
        login: usuario.login
      });

    } catch (err) {

      if (err instanceof CadastroInvalido) {
        return res.status(400).json({ erro: 'Dados de cadastro invalidos.' });
      }
      if (err instanceof LoginJaCadastrado) {
        return res.status(409).json({ erro: 'Login ja cadastrado.' });
      }

      console.error(err);

      return res.status(500).json({ erro: 'Não foi possivel cadastrar o usuário.' });
    }
  };

  login = async (req: Request, res: Response) => {
    try {

      const sessao = await this.casos.iniciarSessao.executar({
        login: req.body?.login,
        senha: req.body?.senha
      });

      return res.json({
        token: sessao.token,
        usuario: {
          id: sessao.usuario.id,
          nome: sessao.usuario.nome,
          login: sessao.usuario.login
        }
      });

    } catch (err) {

      if ( err instanceof DadosLoginInvalidos ) {
         return res.status(400).json({ erro: 'Informe login e senha.' });
      }
      if (err instanceof CredenciaisInvalidas) {
        return res.status(401).json({ erro: 'Login ou senha invalidos.' });
      }

      console.error(err);
      return res.status(500).json({ erro: 'Não foi possível iniciar a sessao.' });

    }

  };

  me = async (req: Request, res: Response) => {
    try {

      const usuario = await this.casos.consultarSessao.executar(tokenDo(req));
      return res.json({
        id: usuario.id,
        nome: usuario.nome,
        login: usuario.login
      });

    } catch (err) {

      if (err instanceof TokenSessaoObrigatorio) {
         return res.status(401).json({ erro: 'Token de sessao obrigatorio.' });
      }

      if (err instanceof SessaoInvalida) {
        return res.status(401).json({ erro: 'Sessão invalida ou expirada.' });
      }

      console.error(err);
      return res.status(500).json({ erro: 'Não foi possivel consultar a sessao!' });

    }

  };

  logout = async (req: Request, res: Response) => {
    try {

      await this.casos.encerrarSessao.executar(tokenDo(req));
      return res.status(204).end();

    } catch (err) {

      if (err instanceof TokenSessaoObrigatorio) {
        return res.status(401).json({ erro: 'Token de sessão obrigatorio.' });
      }

      console.error(err);
      return res.status(500).json({ erro: 'Não foi possivel encerrar a sessao.' });

    }
  };
}

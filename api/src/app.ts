import express from 'express';
import swaggerUi from 'swagger-ui-express';
import type { Pool } from 'mysql2/promise';
import { AuthController } from './identidade/http/AuthController';
import { authRoutes } from './identidade/http/authRoutes';
import { CadastrarUsuario } from './identidade/aplicacao/CadastrarUsuario';
import { ConsultarSessaoAtual } from './identidade/aplicacao/ConsultarSessaoAtual';
import { EncerrarSessao } from './identidade/aplicacao/EncerrarSessao';
import { IniciarSessao } from './identidade/aplicacao/IniciarSessao';
import { MySqlSessaoRepositorio } from './identidade/infraestrutura/MySqlSessaoRepositorio';
import { MySqlUsuarioRepositorio } from './identidade/infraestrutura/MySqlUsuarioRepositorio';
import { OpaqueTokenSessao } from './identidade/infraestrutura/OpaqueTokenSessao';
import { ScryptPasswordHasher } from './identidade/infraestrutura/ScryptPasswordHasher';
import { AtualizarReceita } from './receitas/aplicacao/AtualizarReceita';
import { CadastrarReceita } from './receitas/aplicacao/CadastrarReceita';
import { ConsultarReceita } from './receitas/aplicacao/ConsultarReceita';
import { ExcluirReceita } from './receitas/aplicacao/ExcluirReceita';
import { ListarReceitas } from './receitas/aplicacao/ListarReceitas';
import { MySqlReceitaRepositorio } from './receitas/infraestrutura/MySqlReceitaRepositorio';
import { ReceitaController } from './receitas/http/ReceitaController';
import { receitaRoutes } from './receitas/http/receitaRoutes';
import { healthRoutes } from './sistema/healthRoute';
import { db } from './db';
import { swaggerDocument } from './swagger';

export function createApp(pool: Pool = db) {

  const app = express();
  const usuarios = new MySqlUsuarioRepositorio(pool);
  const sessoes = new MySqlSessaoRepositorio(pool);
  const receitas = new MySqlReceitaRepositorio(pool);

  const senhas = new ScryptPasswordHasher();
  const tokens = new OpaqueTokenSessao();
  const consultarSessao = new ConsultarSessaoAtual(sessoes, tokens);

  const controller = new AuthController({
    cadastrarUsuario: new CadastrarUsuario(usuarios, senhas),
    iniciarSessao: new IniciarSessao(usuarios, sessoes, senhas, tokens),
    consultarSessao,
    encerrarSessao: new EncerrarSessao(sessoes, tokens)
  });

  const receitaController = new ReceitaController(consultarSessao, {
    cadastrar: new CadastrarReceita(receitas),
    listar: new ListarReceitas(receitas),
    consultar: new ConsultarReceita(receitas),
    atualizar: new AtualizarReceita(receitas),
    excluir: new ExcluirReceita(receitas)
  });


  app.use(express.json());
  app.get('/api-docs.json', (_req, res) => res.json(swaggerDocument));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(authRoutes(controller));
  app.use(receitaRoutes(receitaController));
  app.use(healthRoutes(pool));

  return app;

}

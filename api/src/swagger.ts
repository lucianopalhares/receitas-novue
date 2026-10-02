// documetacao fica separada daqui pra não embolar o index
export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Receitas API',
    version:  '1.0.0',
    description: 'Cadastro e acesso de usuários da API.'
  },
  servers: [ { url: '/' } ],
  tags: [
    { name: 'Usuários', description: 'Cadastro e sessão de usuário' },
    { name: 'Sistema', description: 'Estado da API' }
  ],
  paths: {
    '/usuarios': {
      post: {
        tags: ['Usuários'],
        summary: 'Cadastrar usuário',
        description: 'A senha deve ter entre 8 e 128 caracteres.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NovoUsuario' },
              example: {
                nome: 'Ana Silva',
                login: 'ana',
                senha: 'Senha123!'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Usuário cadastrado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Usuario' }
              }
            }
          },
          '400': {
            description: 'Dados de cadastro inválidos.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' }
              }
            }
          },
          '409': {
            description: 'Login já cadastrado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' }
              }
            }
          },
          '500': {
            description: 'Erro ao cadastrar usuário.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' }
              }
            }
          }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Usuários'],
        summary: 'Fazer login',
        description: 'O token retornado expira em 7 dias.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Login' },
              example: { login: 'ana', senha: 'Senha123!' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login realizado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Sessao' }
              }
            }
          },
          '400': {
            description: 'Login e senha são obrigatórios.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' }
              }
            }
          },
          '401': {
            description: 'Credenciais inválidas.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' }
              }
            }
          },
          '500': {
            description: 'Erro ao iniciar sessão.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' }
              }
            }
          }
        }
      }
    },
    '/auth/logout': {
      post: {
        tags: ['Usuários'],
        summary: 'Encerrar sessão',
        security: [{ bearerAuth: [] }],
        responses: {
          '204': { description: 'Sessão encerrada.' },
          '401': {
            description: 'Cabeçalho Bearer ausente ou malformado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { erro: 'Token de sessão obrigatório.' }
              }
            }
          },
          '500': {
            description: 'Erro ao encerrar sessão.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { erro: 'Não foi possível encerrar a sessão.' }
              }
            }
          }
        }
      }
    },
    '/health': {
      get: {
        tags: ['Sistema'],
        summary: 'Verificar API e banco',
        responses: {
          '200': {
            description: 'API e banco disponíveis.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    database: { type: 'string', example: 'conectado' }
                  }
                }
              }
            }
          },
          '503': {
            description: 'Banco indisponível.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'error' },
                    database: { type: 'string', example: 'disconectado' }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
       bearerFormat:  'opaque token'
      }
    },
    schemas: {
      NovoUsuario: {
        type: 'object',
        required: ['nome', 'login', 'senha'],
        properties: {
          nome: { type: 'string', maxLength: 100, example: 'Ana Silva' },
          login: { type: 'string', maxLength: 100, example: 'ana' },
          senha: { type: 'string', minLength: 8, maxLength: 128, example: 'Senha123!' }
        }
      },
      Login: {
        type: 'object',
        required: ['login', 'senha'],
        properties: {
          login: { type: 'string', example: 'ana' },
          senha: { type: 'string', example: 'Senha123!' }
        }
      },
      Usuario: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nome: { type: 'string', example: 'Ana Silva' },
          login: { type: 'string', example: 'ana' }
        }
      },
      Sessao: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'token-de-sessao' },
          usuario: { $ref: '#/components/schemas/Usuario' }
        }
      },
      Erro: {
        type: 'object',
        properties: {
          erro: { type: 'string' }
        }
      }
    }
  }
};

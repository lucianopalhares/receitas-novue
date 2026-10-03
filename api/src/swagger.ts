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
      { name: 'Receitas', description: 'Receitas do usuário autenticado' },
    { name: 'Categorias', description: 'Categorias disponíveis para receitas' },
      { name: 'Sistema', description: 'Estado da API' }
  ],
  paths: {
      '/categorias': {
      get: {
          tags: ['Categorias'],
        summary: 'Listar categorias disponíveis para receitas',
        security: [{ bearerAuth: [] }],
          responses: {
          '200': {
              description: 'Categorias disponíveis.',
            content: {
              'application/json': {
                  schema: {
                  type: 'array',
                    items: { $ref: '#/components/schemas/Categoria' }
                }
              }
              }
          },
            '401': { description: 'Sessão inválida ou expirada.' },
          '500': { description: 'Não foi possível listar as categorias.' }
        }
        }
    },
      // Receitas ficam sempre limitadas pela sessão atual.
    '/receitas': {
      get: {
          tags: ['Receitas'],
        summary: 'Listar ou pesquisar receitas do usuário atual',
          description: 'A busca opcional considera nome e ingredientes.',
        security: [{ bearerAuth: [] }],
        parameters: [{
            in: 'query',
          name: 'q',
            schema: { type: 'string' },
          description: 'Texto para pesquisar nas receitas.'
        }],
          responses: {
          '200': {
              description: 'Receitas do usuário autenticado.',
            content: {
              'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Receita' } }
              }
              }
          },
          '401': { description: 'Sessão inválida ou expirada.' }
          }
      },
        post: {
        tags: ['Receitas'],
        summary: 'Cadastrar receita para o usuário atual',
          security: [{ bearerAuth: [] }],
        requestBody: {
            required: true,
          content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/DadosReceita' },
              example: {
                  categoriaId: 7,
                nome: 'Macarrão ao molho',
                tempoPreparoMinutos: 30,
                  porcoes: 4,
                modoPreparo: 'Cozinhe a massa e misture ao molho.',
                  ingredientes: 'Massa, tomate e temperos'
              }
            }
            }
        },
          responses: {
          '201': {
            description: 'Receita cadastrada.',
              content: {
              'application/json': {
                  schema: { $ref: '#/components/schemas/Receita' }
              }
            }
            },
          '400': { description: 'Dados da receita inválidos.' },
            '401': { description: 'Sessão inválida ou expirada.' }
        }
      }
      },
    '/receitas/{id}': {
        get: {
        tags: ['Receitas'],
        summary: 'Consultar receita do usuário atual',
          security: [{ bearerAuth: [] }],
        parameters: [{
            in: 'path',
          name: 'id',
          required: true,
            schema: { type: 'integer' }
        }],
          responses: {
          '200': {
            description: 'Receita encontrada.',
              content: {
              'application/json': {
                  schema: { $ref: '#/components/schemas/Receita' }
              }
            }
            },
          '400': { description: 'Id inválido.' },
            '401': { description: 'Sessão inválida ou expirada.' },
          '404': { description: 'Receita não encontrada.' }
        }
        },
      put: {
          tags: ['Receitas'],
        summary: 'Atualizar receita do usuário atual',
        security: [{ bearerAuth: [] }],
          parameters: [{
          in: 'path',
            name: 'id',
          required: true,
          schema: { type: 'integer' }
          }],
        requestBody: {
            required: true,
          content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/DadosReceita' }
            }
            }
        },
        responses: {
            '200': {
            description: 'Receita atualizada.',
              content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Receita' }
                }
            }
            },
          '400': { description: 'Dados ou id inválidos.' },
          '401': { description: 'Sessão inválida ou expirada.' },
            '404': { description: 'Receita não encontrada.' }
        }
        },
      delete: {
        tags: ['Receitas'],
          summary: 'Excluir receita do usuário atual',
        security: [{ bearerAuth: [] }],
          parameters: [{
          in: 'path',
          name: 'id',
            required: true,
          schema: { type: 'integer' }
          }],
        responses: {
          '204': { description: 'Receita excluída.' },
            '400': { description: 'Id inválido.' },
          '401': { description: 'Sessão inválida ou expirada.' },
            '404': { description: 'Receita não encontrada.' }
        }
      }
      },
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
      '/auth/me': {
      get: {
          tags: ['Usuários'],
        summary: 'Consultar usuário da sessão atual',
        security: [{ bearerAuth: [] }],
          responses: {
          '200': {
              description: 'Usuário autenticado.',
            content: {
              'application/json': {
                  schema: { $ref: '#/components/schemas/Usuario' }
              }
              }
          },
          '401': {
              description: 'Token ausente, inválido ou expirado.',
            content: {
                'application/json': {
                schema: { $ref: '#/components/schemas/Erro' }
              }
              }
          },
            '500': {
            description: 'Erro ao consultar sessão.',
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
      Categoria: {
          type: 'object',
        properties: {
            id: { type: 'integer', example: 7 },
          nome: { type: 'string', nullable: true, example: 'Massas' }
        }
        },
      DadosReceita: {
          type: 'object',
        required: ['modoPreparo'],
        properties: {
            categoriaId: { type: 'integer', nullable: true, example: 7 },
          nome: { type: 'string', nullable: true, maxLength: 45, example: 'Macarrão ao molho' },
            tempoPreparoMinutos: { type: 'integer', nullable: true, minimum: 0, example: 30 },
          porcoes: { type: 'integer', nullable: true, minimum: 0, example: 4 },
          modoPreparo: { type: 'string', example: 'Cozinhe a massa e misture ao molho.' },
            ingredientes: { type: 'string', nullable: true, example: 'Massa, tomate e temperos' }
        }
        },
      Receita: {
        allOf: [
            { $ref: '#/components/schemas/DadosReceita' },
          {
              type: 'object',
            properties: {
              id: { type: 'integer', example: 12 },
                categoriaNome: { type: 'string', nullable: true, example: 'Massas' },
              criadoEm: { type: 'string', format: 'date-time' },
                alteradoEm: { type: 'string', format: 'date-time' }
            }
          }
          ]
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

# Receitas

Aplicação web para cada usuário organizar as receitas culinarias. Cadastro de uma conta, entrar, cadastrar receitas, pesquisar por nome ou ingrediente, editar, excluir e imprimir.

## Tecnologias

- Frontend: Vue 3 e TypeScript
- API REST: Node.js, TypeScript e Express
- Banco de dados: MySQL
- Documentação da API: Swagger
- Execução local: Docker Compose

## Organização do projeto

A API e o frontend são separados. Por exemplo, identidade concentra cadastro e sessão, receitas concentra as operações de receita e categorias são as categorias disponíveis.

## Como o código está organizado

Na API, cada funcionalidade tem camadas com funções diferentes:

- `dominio/`: entidades e dados centrais da funcionalidade.
- `aplicacao/`: casos de uso, como cadastrar, listar e atualizar receitas.
- `http/`: rotas REST e controllers que recebem as requisições.
- `infraestrutura/`: acesso ao MySQL e serviços técnicos, como tokens e hash de senha.

No Vue, as pastas tem divisão parecida:

- `apresentacao/`: telas e estado usado pela interface.
- `aplicacao/`: ações disponíveis para a interface.
- `dominio/`: tipos e dados da funcionalidade.
- `infraestrutura/`: chamadas HTTP para API e armazenamento da sessão no navegador.

## Como a arquitetura funciona

Quando alguém salva uma receita, a tela Vue chama uma ação da aplicação. Essa ação usa o adaptador HTTP para enviar a requisição à API. Na API, a rota encaminha os dados pro controller, que checa a sessão e chama o caso de uso. O caso de uso usa a porta do repositório, que tem a implementação MySQL que lê ou grava os dados no banco.

Ou seja. A interface não precisa conhecer consultas SQL, e as regras das operações não ficam juntas com a tela ou com os detalhes do banco. Facilita por exemplo a localizar mudanças, manter o projeto e testar casos de usos separadamente.

## Como iniciar

Requisitos: Docker e Docker Compose.

Na raiz do projeto, execute:

```sh
docker compose up --build
```

O Compose inicia MySQL, API e frontend ao mesmo tempo. Na primeira inicialização do banco, os scripts SQL configurados no Compose são aplicados. Depois, acesse:

- Frontend: http://localhost:8187
- API: http://localhost:3005/health
- Swagger: http://localhost:3005/api-docs

Crie uma conta pelo frontend para entrar e usar as receitas.

Para encerrar os serviços, pressione `Ctrl+C` ou execute na raiz:

```sh
docker compose down
```

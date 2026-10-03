# Receitas

Aplicação com frontend em Vue, API em Node.js/TypeScript e banco MySQL.

## Requisitos

- Docker
- Docker Compose

## Iniciar a aplicação

Na raiz do projeto, execute:

```sh
docker compose up --build
```

O Compose inicia o banco, a API e o frontend. Na primeira execução, o banco é preparado pelos scripts SQL do projeto. Aguarde uns 2 minutos ate os serviços ficarem prontos e acesse:

- Frontend: http://localhost:8187
- API: http://localhost:3005
- Swagger da API: http://localhost:3005/api-docs

Crie uma conta pelo frontend e entre para usar as receitas.

Para parar os serviços, pressione `Ctrl+C` ou, em outro terminal na raiz, execute:

```sh
docker compose down
```

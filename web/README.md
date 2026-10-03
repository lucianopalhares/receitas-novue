# Aplicação web

O painel usa Vue 3 e typeScript. A pasta `src/identidade` separa domínio, casos de uso, portas, integração HTTP e apresentação. O dashboard fica protegido por sessão e está vazio, esta pronto pra receber modulos depois. 

## Rodar com docker

Na raiz do repositório:

```sh
docker compose up --build
```

Abra `http://localhost:8187`. A API fica em `http://localhost:3005` e o Swagger em `http://localhost:3005/api-docs`. O Nginx do frontend encaminha as chamadas de autenticação para o serviço `api` na rede do Compose.

Crie uma conta pela opção **Criar conta** e depois entre com o login e a senha cadastrados. O token é guardado no navegador; sair encerra a sessão na API e remove o token local.

Para parar os serviços, use `Ctrl+C` ou execute `docker compose down` na raiz. O banco continua no volume nomeado do Compose.

## Rodar o frontend em desenvolvimento

Com Docker disponível, inicie banco e API na raiz:

```sh
docker compose up --build db api
```

Em outro terminal:

```sh
cd web
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite (por padrão, `http://localhost:5173`). O proxy do Vite encaminha as rotas da API para `http://localhost:3005`.

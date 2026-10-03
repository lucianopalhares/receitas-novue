export type Usuario = {
  id: number;
  nome: string;

  login: string;
};

export type Sessao = {
  token: string;
  usuario: Usuario;
};

export type DadosCadastro = {
  nome: string;
  login: string;
  senha: string;
};

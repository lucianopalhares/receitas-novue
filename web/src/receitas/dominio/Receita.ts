export type Receita = {
id: number;
categoriaId: number | null;
categoriaNome: string | null;
nome: string | null;
tempoPreparoMinutos: number | null;
porcoes: number | null;
modoPreparo: string;
ingredientes: string | null;
criadoEm: string;
alteradoEm: string;
};

export type CategoriaReceita = {
id: number;
  nome: string | null;
};


export type DadosReceita = {
categoriaId: number | null;
nome: string | null;
tempoPreparoMinutos: number | null;
porcoes: number | null;
modoPreparo: string;
ingredientes: string | null;
};

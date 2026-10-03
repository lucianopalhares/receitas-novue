export class Receita {
  constructor(
    readonly id: number,
    readonly categoriaId: number | null,
    readonly categoriaNome: string | null,
    readonly nome: string | null,
    readonly tempoPreparoMinutos: number | null,
    readonly porcoes: number | null,
    readonly modoPreparo: string,
    readonly ingredientes: string | null,
    readonly criadoEm: Date,
    readonly alteradoEm: Date
  ) {

  }
}

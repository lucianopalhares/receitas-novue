export class Sessao {
  constructor(
    readonly usuarioId: number,
    readonly tokenHash: string,
    readonly expiraEm: Date
  ) {}

  ativaEm(data: Date = new Date()) {
    return this.expiraEm.getTime() > data.getTime();
  }
}

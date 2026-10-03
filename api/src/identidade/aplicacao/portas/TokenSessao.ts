export interface TokenSessao {
  gerar(): string;
  hash(token: string): string;
}

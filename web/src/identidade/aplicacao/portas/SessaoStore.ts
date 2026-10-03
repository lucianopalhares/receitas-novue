export interface SessaoStore {
  obterToken(): string | null;
  salvarToken(token: string): void;

  limpar(): void;
}

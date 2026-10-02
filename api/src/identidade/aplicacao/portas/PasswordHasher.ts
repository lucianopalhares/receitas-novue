export interface PasswordHasher {
  hash( senha: string ): string;
  verificar( senha: string, hashSalvo: string ): boolean;
}

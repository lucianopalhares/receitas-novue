import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { PasswordHasher } from '../aplicacao/portas/PasswordHasher';

export class ScryptPasswordHasher implements PasswordHasher {

  hash(senha: string) {

    const salt = randomBytes(16).toString('base64url');
    const hash = scryptSync(senha, salt, 48).toString('base64url');

    return salt+'.'+hash;

  }

  verificar(senha: string, salvo: string) {

    const [salt, hash] = salvo.split('.');
    if (!salt || !hash) return false;

    const esperado = Buffer.from(hash, 'base64url');
    const atual = scryptSync(senha, salt, 48);
    if (esperado.length !== atual.length) return false;

    return timingSafeEqual(esperado, atual);
  }

}

import { createHash, randomBytes } from 'node:crypto';
import type { TokenSessao } from '../aplicacao/portas/TokenSessao';

export class OpaqueTokenSessao implements TokenSessao {

  gerar() {
    return randomBytes(32).toString('base64url');
  }

  hash(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

}

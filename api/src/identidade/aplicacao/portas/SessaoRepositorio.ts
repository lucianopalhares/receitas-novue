import type { Sessao } from '../../dominio/Sessao';
import type { Usuario } from '../../dominio/Usuario';


export interface SessaoRepositorio {
  criar(sessao: Sessao): Promise<void>;
  buscarPorTokenHash(tokenHash: string):  Promise<{ sessao: Sessao; usuario: Usuario } | null>;
  removerPorTokenHash(tokenHash: string): Promise<void>;
}

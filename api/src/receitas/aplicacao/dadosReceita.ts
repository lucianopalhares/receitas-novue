import { ReceitaInvalida } from './erros';
import type { DadosReceita } from './portas/ReceitaRepositorio';

function textoOpcional(valor: unknown) {

  if (valor === undefined || valor === null || valor === '') return null;
  if (typeof valor !== 'string') throw new ReceitaInvalida();

  return valor;
}

function numeroOpcional(valor: unknown, obrigatorioMaiorQueZero = false) {
  if (valor === undefined || valor === null || valor === '') return null;

  if (typeof valor !== 'number' || !Number.isInteger(valor) ||
      valor < (obrigatorioMaiorQueZero ? 1 : 0) || valor > 4294967295) {
      throw new ReceitaInvalida();
  }
  return valor;
}

export function validarDadosReceita(entrada: unknown): DadosReceita {
  const dados = typeof entrada === 'object' && entrada !== null && !Array.isArray(entrada)
    ? entrada as Record<string, unknown>
    : {};

  const nome = textoOpcional(dados.nome);

  const modoPreparo = dados.modoPreparo;
  const ingredientes = textoOpcional(dados.ingredientes);


  if ((nome && nome.trim().length > 45) || typeof modoPreparo !== 'string' ||
      !modoPreparo.trim()) {
    throw new ReceitaInvalida();
  }

  return {
    categoriaId: numeroOpcional(dados.categoriaId, true),
    nome:  nome?.trim() || null,
    tempoPreparoMinutos: numeroOpcional(dados.tempoPreparoMinutos),
    porcoes: numeroOpcional(dados.porcoes),
    modoPreparo: modoPreparo.trim(),
    ingredientes
  };
}

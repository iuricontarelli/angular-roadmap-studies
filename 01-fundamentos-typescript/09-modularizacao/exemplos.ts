// arquivo: matematica.ts
export const PI = 3.14159;

export function soma(a: number, b: number): number {
  return a + b;
}

export function multiplicar(a: number, b: number): number {
  return a * b;
}

// arquivo: saudacao.ts
export default function saudar(nome: string): void {
  console.log(`Olá, ${nome}!`);
}

// arquivo: app.ts
import { PI, soma, multiplicar } from './matematica';
import saudar from './saudacao';

console.log(soma(PI, 10));
console.log(multiplicar(2, 5));
saudar("Iuri");

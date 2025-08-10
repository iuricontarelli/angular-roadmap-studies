// 1. Função genérica simples
function identidade<T>(valor: T): T {
  return valor;
}

console.log(identidade<string>("Iuri"));
console.log(identidade<number>(10));

// 2. Função genérica com array
function primeiroElemento<T>(array: T[]): T {
  return array[0];
}

console.log(primeiroElemento([1, 2, 3]));
console.log(primeiroElemento(["a", "b", "c"]));

// 3. Classe genérica
class Caixa<T> {
  private conteudo: T;

  constructor(conteudo: T) {
    this.conteudo = conteudo;
  }

  abrir(): T {
    return this.conteudo;
  }
}

const caixaString = new Caixa<string>("Olá");
console.log(caixaString.abrir());

const caixaNumero = new Caixa<number>(123);
console.log(caixaNumero.abrir());

// 4. Generics com restrição
interface Pessoa {
  nome: string;
}

function apresentar<T extends Pessoa>(obj: T): void {
  console.log(`Olá, ${obj.nome}`);
}

apresentar({ nome: "Iuri", idade: 25 });

// 5. Múltiplos parâmetros genéricos
function par<K, V>(chave: K, valor: V) {
  return { chave, valor };
}

console.log(par("idade", 25));
console.log(par(1, true));

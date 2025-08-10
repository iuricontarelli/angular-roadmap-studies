// 1. Arrays
let numeros: number[] = [1, 2, 3];
numeros.push(4);
console.log(numeros);

let nomes: Array<string> = ['Iuri', 'João'];
nomes.push('Maria');
console.log(nomes);

// 2. Tuplas
let pessoa: [string, number] = ['Iuri', 25];
console.log(`Nome: ${pessoa[0]}, Idade: ${pessoa[1]}`);

// 3. Enums
enum Cor {
  Vermelho,
  Verde,
  Azul
}
let minhaCor: Cor = Cor.Verde;
console.log(minhaCor); // 1

enum Status {
  Sucesso = 200,
  Erro = 500
}
console.log(Status.Sucesso); // 200

// 4. any
let valor: any = 10;
valor = 'texto';
valor = true;

// 5. unknown
let dado: unknown = 'Iuri';
if (typeof dado === 'string') {
  console.log(dado.toUpperCase());
}

// 6. void
function logMensagem(msg: string): void {
  console.log(msg);
}
logMensagem('Executando log');

// 7. never
function erro(mensagem: string): never {
  throw new Error(mensagem);
}

function esperar(): never {
  while (true) {
    console.log("Rodando...");
  }
}

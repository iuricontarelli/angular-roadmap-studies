// Exemplo 1: Função tradicional com tipagem
function saudacao(nome: string): string {
  return `Olá, ${nome}!`;
}

console.log(saudacao("Iuri"));

// Exemplo 2: Função com parâmetro opcional
function apresentar(nome: string, idade?: number): string {
  if (idade !== undefined) {
    return `${nome} tem ${idade} anos.`;
  }
  return `${nome} não informou a idade.`;
}

console.log(apresentar("Iuri", 25));
console.log(apresentar("Maria"));

// Exemplo 3: Parâmetro com valor padrão
function desconto(valor: number, percentual: number = 10): number {
  return valor - (valor * percentual) / 100;
}

console.log(desconto(100)); // usa 10%
console.log(desconto(100, 20)); // usa 20%

// Exemplo 4: Arrow Function
const dobrar = (n: number): number => n * 2;
console.log(dobrar(5));

// Exemplo 5: Arrow Function com retorno implícito
const paraMaiusculas = (texto: string): string => texto.toUpperCase();
console.log(paraMaiusculas("angular"));

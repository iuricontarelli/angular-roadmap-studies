// 1. Type Assertion com `as`
let valor: unknown = "Iuri";
let tamanho = (valor as string).length;
console.log(tamanho);

// 2. Type Assertion com `<>`
let outroValor: unknown = "TypeScript";
let tamanho2 = (<string>outroValor).length;
console.log(tamanho2);

// 3. Exemplo prático com DOM
// Necessário rodar em ambiente com DOM (navegador)
// const input = document.getElementById("meuInput") as HTMLInputElement;
// input.value = "Novo valor";

// 4. Trabalhando com any
let dados: any = 12345;
let numero = dados as number;
console.log(numero.toFixed(2));

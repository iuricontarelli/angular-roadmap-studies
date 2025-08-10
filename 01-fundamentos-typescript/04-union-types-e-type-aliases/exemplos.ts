// 1. Union Types
let id: string | number;
id = 10;
id = "ABC";
// id = true; // Erro: boolean não é permitido

// 2. Union Types em funções
function imprimirId(id: string | number): void {
  console.log(`O ID é: ${id}`);
}
imprimirId(123);
imprimirId("ABC");

// 3. Narrowing (checagem do tipo antes de usar)
function processarValor(valor: string | number) {
  if (typeof valor === 'string') {
    console.log(valor.toUpperCase()); // Métodos de string
  } else {
    console.log(valor.toFixed(2)); // Métodos de number
  }
}
processarValor("Olá");
processarValor(42.1234);

// 4. Type Alias
type Id = string | number;
let usuarioId: Id;
usuarioId = 101;
usuarioId = "A55";

// 5. Type Alias com objetos
type Usuario = {
  nome: string;
  idade: number;
};

const usuario: Usuario = {
  nome: "Iuri",
  idade: 25
};
console.log(usuario);

# Generics no TypeScript

---

## 1. O que são Generics?
Generics permitem criar **componentes reutilizáveis** que funcionam com **qualquer tipo**, mantendo a tipagem.

```ts
function identidade<T>(valor: T): T {
  return valor;
}

console.log(identidade<string>("Iuri"));
console.log(identidade<number>(10));
```

- `<T>` é um **parâmetro de tipo** (pode ter qualquer nome, mas `T` é comum).
- Ele é substituído pelo tipo real quando a função é usada.

---

## 2. Funções genéricas
```ts
function primeiroElemento<T>(array: T[]): T {
  return array[0];
}

console.log(primeiroElemento([1, 2, 3])); // infere T = number
console.log(primeiroElemento(["a", "b", "c"])); // infere T = string
```

---

## 3. Classes genéricas
```ts
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
```

---

## 4. Generics com restrições (`extends`)
Podemos restringir quais tipos são aceitos.

```ts
interface Pessoa {
  nome: string;
}

function apresentar<T extends Pessoa>(obj: T): void {
  console.log(`Olá, ${obj.nome}`);
}

apresentar({ nome: "Iuri", idade: 25 }); // válido
// apresentar({ idade: 25 }); // erro
```

---

## 5. Vários parâmetros genéricos
```ts
function par<K, V>(chave: K, valor: V) {
  return { chave, valor };
}

console.log(par("idade", 25));
console.log(par(1, true));
```

---

## Resumo rápido
- Generics permitem criar código reutilizável e tipado.
- `<T>` define um tipo genérico.
- Pode usar restrições com `extends`.
- Pode usar múltiplos parâmetros genéricos.

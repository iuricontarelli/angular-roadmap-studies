# Union Types e Type Aliases no TypeScript

---

## 1. Union Types
Union Types permitem que uma variável, parâmetro ou retorno possa ter **mais de um tipo possível**.

```ts
let id: string | number;
id = 10;      // válido
id = "ABC";   // válido
// id = true; // inválido
```

**Uso comum em funções**:
```ts
function imprimirId(id: string | number): void {
  console.log(`O ID é: ${id}`);
}
imprimirId(123);
imprimirId("ABC");
```

---

## 2. Narrowing (Aperto de tipo)
Quando usamos Union Types, o TypeScript exige que verifiquemos o tipo antes de usar métodos específicos.

```ts
function processarValor(valor: string | number) {
  if (typeof valor === 'string') {
    console.log(valor.toUpperCase()); // aqui é string
  } else {
    console.log(valor.toFixed(2)); // aqui é number
  }
}
```

---

## 3. Type Aliases
Um Type Alias permite criar um **apelido** para um tipo, seja ele simples ou complexo.

```ts
type Id = string | number;
let usuarioId: Id;
usuarioId = 101;
usuarioId = "A55";
```

---

## 4. Type Aliases com objetos
Também podemos criar aliases para tipos de objetos.

```ts
type Usuario = {
  nome: string;
  idade: number;
};

const usuario: Usuario = {
  nome: "Iuri",
  idade: 25
};
```

---

## 5. Benefícios
- Código mais legível
- Evita repetição de tipos
- Facilita manutenção e refatoração

---

## Resumo rápido
- **Union Types** → permitem múltiplos tipos (`string | number`)
- **Narrowing** → checagem do tipo em tempo de execução
- **Type Alias** → cria um nome para um tipo, evitando repetição

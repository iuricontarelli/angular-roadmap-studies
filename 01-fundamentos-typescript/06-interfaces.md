# Interfaces no TypeScript

---

## 1. O que é uma Interface?
Interface é uma forma de definir a **estrutura de um objeto** no TypeScript, especificando as propriedades e seus tipos.

```ts
interface Usuario {
  nome: string;
  idade: number;
}
```

---

## 2. Usando uma Interface
```ts
interface Usuario {
  nome: string;
  idade: number;
}

const user: Usuario = {
  nome: "Iuri",
  idade: 25
};
```

---

## 3. Propriedades opcionais
```ts
interface Usuario {
  nome: string;
  idade?: number; // opcional
}

const user1: Usuario = { nome: "Iuri" }; // válido
```

---

## 4. Propriedades readonly
Propriedades que não podem ser alteradas após a criação do objeto.

```ts
interface Usuario {
  readonly id: number;
  nome: string;
}
```

---

## 5. Métodos em interfaces
```ts
interface Usuario {
  nome: string;
  saudar(): void;
}

const user: Usuario = {
  nome: "Iuri",
  saudar() {
    console.log(`Olá, ${this.nome}`);
  }
};
```

---

## 6. Herança entre interfaces
Uma interface pode estender outra.

```ts
interface Pessoa {
  nome: string;
}

interface Usuario extends Pessoa {
  idade: number;
}
```

---

## 7. Diferença entre Interface e Type Alias
- **Interface** → Mais usada para objetos e contratos de classes.
- **Type Alias** → Mais flexível (pode definir qualquer tipo, não só objetos).
- Em muitos casos podem ser usados de forma parecida, mas `interface` permite **mesclar declarações** (reabrir e adicionar mais propriedades).

---

## Resumo rápido
- Interface define **forma de um objeto**
- Pode ter propriedades opcionais (`?`) e somente leitura (`readonly`)
- Pode ter métodos
- Suporta herança

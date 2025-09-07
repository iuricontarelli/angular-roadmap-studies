# Classes e Herança no TypeScript

---

## 1. O que é uma classe?
Uma **classe** é um modelo para criar objetos com propriedades e métodos.

```ts
class Pessoa {
  nome: string;
  idade: number;

  constructor(nome: string, idade: number) {
    this.nome = nome;
    this.idade = idade;
  }

  apresentar(): void {
    console.log(`Olá, meu nome é ${this.nome} e tenho ${this.idade} anos.`);
  }
}
```

---

## 2. Modificadores de acesso
- **public** → Acesso livre (padrão)
- **private** → Apenas dentro da própria classe
- **protected** → Dentro da classe e de subclasses

```ts
class Conta {
  public numero: string; // visível para todos
  private saldo: number; // apenas dentro da classe
  protected agencia: string; // classe e subclasses

  constructor(numero: string, saldo: number, agencia: string) {
    this.numero = numero;
    this.saldo = saldo;
    this.agencia = agencia;
  }
}
```

---

## 3. Herança
Uma classe pode **herdar** de outra para reutilizar código.

```ts
class Animal {
  mover(): void {
    console.log("O animal se moveu.");
  }
}

class Cachorro extends Animal {
  latir(): void {
    console.log("Au au!");
  }
}

const dog = new Cachorro();
dog.mover(); // herdado de Animal
dog.latir(); // método da própria classe
```

---

## 4. Sobrescrita de métodos
Uma subclasse pode sobrescrever um método da classe pai.

```ts
class Ave extends Animal {
  mover(): void {
    console.log("A ave voou.");
  }
}
```

---

## 5. Classes abstratas
Não podem ser instanciadas diretamente; servem como base para outras.

```ts
abstract class Forma {
  abstract area(): number; // deve ser implementado
}

class Quadrado extends Forma {
  lado: number;

  constructor(lado: number) {
    super();
    this.lado = lado;
  }

  area(): number {
    return this.lado * this.lado;
  }
}
```

---

## Resumo rápido
- Classe → modelo para objetos
- Modificadores: public, private, protected
- Herança com `extends`
- Pode sobrescrever métodos
- Classes abstratas → servem de modelo, não podem ser instanciadas

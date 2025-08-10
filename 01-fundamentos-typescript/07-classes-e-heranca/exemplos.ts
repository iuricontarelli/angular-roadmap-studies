// Classe básica
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

const p1 = new Pessoa("Iuri", 25);
p1.apresentar();

// Modificadores de acesso
class Conta {
  public numero: string;
  private saldo: number;
  protected agencia: string;

  constructor(numero: string, saldo: number, agencia: string) {
    this.numero = numero;
    this.saldo = saldo;
    this.agencia = agencia;
  }

  getSaldo(): number {
    return this.saldo;
  }
}

const conta = new Conta("123", 1000, "001");
// conta.saldo // Erro: saldo é privado

// Herança
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
dog.mover();
dog.latir();

// Sobrescrita
class Ave extends Animal {
  mover(): void {
    console.log("A ave voou.");
  }
}

const passaro = new Ave();
passaro.mover();

// Classe abstrata
abstract class Forma {
  abstract area(): number;
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

const q = new Quadrado(4);
console.log(q.area());

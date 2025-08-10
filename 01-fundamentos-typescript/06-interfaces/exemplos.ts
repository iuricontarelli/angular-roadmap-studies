// 1. Interface básica
interface Usuario {
  nome: string;
  idade: number;
}

const user: Usuario = {
  nome: "Iuri",
  idade: 25
};

// 2. Propriedade opcional
interface UsuarioOpcional {
  nome: string;
  idade?: number;
}

const user1: UsuarioOpcional = { nome: "João" };

// 3. Propriedade readonly
interface UsuarioComId {
  readonly id: number;
  nome: string;
}

const user2: UsuarioComId = { id: 1, nome: "Maria" };
// user2.id = 2; // Erro: readonly

// 4. Métodos em interfaces
interface Saudavel {
  nome: string;
  saudar(): void;
}

const user3: Saudavel = {
  nome: "Carlos",
  saudar() {
    console.log(`Olá, ${this.nome}`);
  }
};

// 5. Herança
interface Pessoa {
  nome: string;
}

interface Funcionario extends Pessoa {
  cargo: string;
}

const dev: Funcionario = {
  nome: "Ana",
  cargo: "Desenvolvedora"
};

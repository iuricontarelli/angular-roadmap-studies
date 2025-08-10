// readonly
interface Produto {
  readonly id: number;
  nome: string;
}
const livro: Produto = { id: 1, nome: "Livro" };
// livro.id = 2; // Erro

// keyof
type Pessoa = { nome: string; idade: number };
type ChavesPessoa = keyof Pessoa;
const chave: ChavesPessoa = "nome";

// in
type Permissoes = "admin" | "user" | "guest";
type PermissoesMap = { [P in Permissoes]: boolean };
const permissoes: PermissoesMap = {
  admin: true,
  user: false,
  guest: true,
};

// typeof
const usuario = { nome: "Iuri", idade: 25 };
type Usuario = typeof usuario;
const outroUsuario: Usuario = { nome: "Maria", idade: 30 };

// infer
type Retorno<T> = T extends (...args: any[]) => infer R ? R : never;
type TipoRetorno = Retorno<() => string>; // string

// satisfies
type Point = { x: number; y: number };
const p = { x: 10, y: 20, z: 30 } satisfies Point;

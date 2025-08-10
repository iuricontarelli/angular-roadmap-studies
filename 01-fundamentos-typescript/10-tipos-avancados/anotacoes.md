# Tipos Avançados no TypeScript

## 1. readonly
Define que a propriedade não pode ser alterada após inicialização.
```ts
interface Produto {
  readonly id: number;
  nome: string;
}

const livro: Produto = { id: 1, nome: "Livro" };
// livro.id = 2; // Erro
```

## 2. keyof
Cria um tipo que é a união de todas as chaves de um tipo.
```ts
type Pessoa = { nome: string; idade: number };
type ChavesPessoa = keyof Pessoa; // "nome" | "idade"
```

## 3. in
Usado para criar tipos a partir de valores possíveis.
```ts
type Permissoes = "admin" | "user" | "guest";
type PermissoesMap = { [P in Permissoes]: boolean };
```

## 4. typeof
Usado para obter o tipo de uma variável ou constante.
```ts
const usuario = { nome: "Iuri", idade: 25 };
type Usuario = typeof usuario; // { nome: string; idade: number }
```

## 5. infer
Permite inferir um tipo dentro de uma condicional de tipo.
```ts
type Retorno<T> = T extends (...args: any[]) => infer R ? R : never;
type TipoRetorno = Retorno<() => string>; // string
```

## 6. satisfies
Verifica se um valor satisfaz um tipo, sem alterar seu tipo inferido.
```ts
type Point = { x: number; y: number };
const p = { x: 10, y: 20, z: 30 } satisfies Point;
// `p` ainda tem a propriedade z
```

---

## Dicas
- Esses tipos avançados são muito úteis em bibliotecas e códigos mais complexos.
- Comece usando aos poucos, conforme sentir necessidade.

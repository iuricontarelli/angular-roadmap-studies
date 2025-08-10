# Type Assertions no TypeScript (`as`, `<>`)

---

## 1. O que é Type Assertion?
Type Assertion (ou "afirmação de tipo") é um recurso que permite **informar ao TypeScript** que um valor deve ser tratado como um tipo específico.

Não converte o valor para outro tipo, apenas diz ao compilador como **interpretar** esse valor.

---

## 2. Sintaxe com `as`
```ts
let valor: unknown = "Iuri";
let tamanho = (valor as string).length;
console.log(tamanho);
```

---

## 3. Sintaxe com `<>`
```ts
let valor: unknown = "Iuri";
let tamanho = (<string>valor).length;
console.log(tamanho);
```

> ⚠️ Esta forma não é recomendada em projetos que usam JSX/TSX (React, Angular com templates JSX), pois `<tipo>` pode ser confundido com tags HTML.

---

## 4. Quando usar?
- Quando o TypeScript **não consegue inferir o tipo** corretamente.
- Quando sabemos mais sobre o tipo do valor do que o compilador.
- Ao trabalhar com `unknown`, `any` ou APIs externas (ex.: `document.getElementById` retorna `HTMLElement | null`).

---

## 5. Exemplo prático com DOM
```ts
const input = document.getElementById("meuInput") as HTMLInputElement;
input.value = "Novo valor";
```

---

## 6. Cuidados
- Não muda o tipo em tempo de execução.
- Usar apenas quando realmente tiver certeza do tipo.
- Usar demais pode indicar problema na tipagem do código.

---

## Resumo rápido
- `as Tipo` → forma mais comum e segura em TypeScript moderno.
- `<Tipo>` → alternativa, mas evite em projetos com JSX.
- Apenas informa ao compilador o tipo que você **garante** que o valor tem.

# Modularização no TypeScript

## O que é
Modularização é a prática de separar o código em arquivos diferentes para melhorar a organização, manutenção e reutilização.

---

## Exportar
Para tornar algo disponível para outros arquivos, usamos `export`.

### Export nomeado
```ts
export const PI = 3.14;

export function soma(a: number, b: number): number {
  return a + b;
}
```

### Export padrão
```ts
export default function mensagem(): void {
  console.log("Mensagem padrão");
}
```

---

## Importar
Para usar código exportado de outro arquivo, usamos `import`.

### Import nomeado
```ts
import { PI, soma } from './meuModulo';
console.log(soma(PI, 10));
```

### Import com alias
```ts
import { soma as somar } from './meuModulo';
console.log(somar(2, 3));
```

### Import padrão
```ts
import mensagem from './mensagem';
mensagem();
```

---

## Dicas
- Cada arquivo pode ter **vários exports nomeados**, mas **apenas um export default**.
- Use modularização para manter o código limpo e organizado.

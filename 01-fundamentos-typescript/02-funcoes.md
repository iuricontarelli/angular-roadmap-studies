# Funções em TypeScript

## O que são
Funções são blocos de código reutilizáveis que recebem parâmetros, executam uma ação e (opcionalmente) retornam um valor.

---

## 1. Declaração tradicional
```ts
function saudacao(nome: string): string {
  return `Olá, ${nome}!`;
}
```
- `nome: string` → tipagem do parâmetro
- `: string` após parênteses → tipagem do valor retornado

---

## 2. Arrow Functions
Forma moderna de escrever funções, muito usada em callbacks e funções curtas.

```ts
const saudacao = (nome: string): string => {
  return `Olá, ${nome}!`;
};
```
Quando o corpo tem apenas 1 linha e retorna algo diretamente:
```ts
const dobro = (x: number): number => x * 2;
```

---

## 3. Tipagem de parâmetros e retorno
```ts
function soma(a: number, b: number): number {
  return a + b;
}
```
- Sempre tipar parâmetros e retorno quando possível.
- TypeScript também consegue inferir o tipo do retorno.

---

## 4. Parâmetros opcionais
Um parâmetro pode ser marcado como opcional com `?`:
```ts
function apresentar(nome: string, idade?: number): string {
  return idade
    ? `${nome} tem ${idade} anos`
    : `${nome} preferiu não dizer a idade`;
}
```

---

## 5. Parâmetros com valor padrão
Podemos definir um valor padrão caso o parâmetro não seja informado:
```ts
function boasVindas(nome: string = 'visitante'): string {
  return `Bem-vindo(a), ${nome}`;
}
```

---

## 6. Observação para Angular (métodos em classes)
Em componentes/serviços do Angular você normalmente declara **métodos de classe**, não funções soltas:
```ts
export class AppComponent {
  nome = 'Iuri';

  dizerOla(): void {
    console.log(`Olá, ${this.nome}`);
  }
}
```
> Dentro de classes, prefira `nomeMetodo(): tipo {}`. Use `function` apenas fora de classes (utilidades, testes rápidos, etc.).

---

## Resumo rápido
- **Função tradicional** → `function nome() {}` (mais comum fora de classes)
- **Método de classe (Angular)** → `nome(): tipo {}`
- **Arrow function** → Sintaxe curta e moderna
- **Parâmetros opcionais** → `param?: tipo`
- **Parâmetros padrão** → `param: tipo = valor`

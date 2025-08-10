# Arrays, Tuplas, Enums e Tipos Especiais no TypeScript

---

## 1. Arrays
Lista ordenada de valores do mesmo tipo.

```ts
let numeros: number[] = [1, 2, 3];
let nomes: Array<string> = ['Iuri', 'João', 'Maria'];
```

**Operações comuns**:
- `push()` → adiciona
- `pop()` → remove o último
- `map()` → transforma cada item
- `filter()` → filtra itens
- `forEach()` → percorre

---

## 2. Tuplas
Arrays com **quantidade e tipos fixos**.

```ts
let pessoa: [string, number] = ['Iuri', 25];
```
- Sempre siga a ordem e o tipo definido.

---

## 3. Enums
Conjunto de valores nomeados, para evitar uso de strings/constantes soltas.

```ts
enum Cor {
  Vermelho,
  Verde,
  Azul
}
let minhaCor: Cor = Cor.Verde;
```
- Por padrão, o primeiro valor é 0, mas você pode atribuir valores específicos.

---

## 4. Tipo `any`
Aceita **qualquer valor** (evitar sempre que possível, pois perde a segurança do TypeScript).

```ts
let valor: any = 10;
valor = 'texto';
valor = true;
```

---

## 5. Tipo `unknown`
Aceita qualquer valor, **mas exige verificação antes do uso**.

```ts
let dado: unknown = 'Iuri';
if (typeof dado === 'string') {
  console.log(dado.toUpperCase());
}
```

---

## 6. Tipo `void`
Indica que a função **não retorna nada**.

```ts
function logMensagem(msg: string): void {
  console.log(msg);
}
```

---

## 7. Tipo `never`
Indica que a função **nunca retorna** (erro ou loop infinito).

```ts
function erro(mensagem: string): never {
  throw new Error(mensagem);
}
```

---

## Resumo rápido
- **Array** → lista de valores tipados
- **Tupla** → lista com tamanho e tipos fixos
- **Enum** → conjunto de constantes nomeadas
- **any** → aceita tudo (evitar)
- **unknown** → aceita tudo, mas exige verificação
- **void** → sem retorno
- **never** → nunca retorna

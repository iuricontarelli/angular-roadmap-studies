## 📌 Principais Operadores do RxJS: `map`, `tap`, `switchMap`, `catchError`

Os **operadores** do RxJS permitem **transformar**, **interceptar**, **encadear** e **tratar erros** em Observables.  
Eles são usados dentro do método `.pipe()`.

---

## 1) `map`
Transforma cada valor emitido em outro.

```ts
import { of, map } from 'rxjs';

of(1, 2, 3).pipe(
  map(n => n * 10)
).subscribe(v => console.log(v)); 
// Saída: 10, 20, 30
```

Uso comum em Angular:
```ts
this.api.listarProdutos().pipe(
  map(produtos => produtos.filter(p => p.preco > 1000))
);
```

---

## 2) `tap`
Executa **efeitos colaterais** sem alterar o valor (ex.: logs, métricas, loading).

```ts
import { of, tap } from 'rxjs';

of('Angular').pipe(
  tap(v => console.log('antes do map:', v)),
  map(v => v.toUpperCase()),
  tap(v => console.log('depois do map:', v))
).subscribe();
```

Uso comum em Angular:
```ts
this.api.buscar(1).pipe(
  tap(() => this.spinner.show()),
  tap({
    next: () => this.spinner.hide(),
    error: () => this.spinner.hide()
  })
);
```

---

## 3) `switchMap`
Troca o fluxo atual por um **novo Observable**, cancelando o anterior.  
Muito usado para **requisições encadeadas** e **buscas com debounce**.

```ts
import { fromEvent, switchMap } from 'rxjs';
import { ajax } from 'rxjs/ajax';

const input = document.querySelector('input')!;

fromEvent(input, 'input').pipe(
  switchMap(e =>
    ajax.getJSON(`/api/busca?q=${(e.target as HTMLInputElement).value}`)
  )
).subscribe(resultado => console.log(resultado));
```

No Angular (exemplo: buscar detalhes de produto pelo ID):
```ts
this.route.paramMap.pipe(
  map(params => params.get('id')),
  switchMap(id => this.api.buscarPorId(Number(id)))
).subscribe(produto => this.produto = produto);
```

> `switchMap` descarta requisições antigas → ideal para autocomplete/busca dinâmica.

---

## 4) `catchError`
Trata erros no fluxo e retorna outro Observable (ou lança novamente).

```ts
import { of, throwError, catchError } from 'rxjs';

throwError(() => new Error('Falhou!')).pipe(
  catchError(err => {
    console.error('Erro tratado:', err.message);
    return of('valor alternativo');
  })
).subscribe(v => console.log(v));
// Saída: "valor alternativo"
```

No Angular (tratamento de erro HTTP):
```ts
this.api.listarProdutos().pipe(
  catchError(err => {
    this.toast.error('Erro ao carregar produtos');
    return of([]); // fallback vazio
  })
);
```

---

## 5) Exemplo completo (composição)
```ts
this.buscaForm.valueChanges.pipe(
  map(v => v.termo),
  tap(() => this.loading.set(true)),
  switchMap(termo => 
    this.api.buscarProdutos(termo).pipe(
      catchError(() => of([]))
    )
  ),
  tap(() => this.loading.set(false))
).subscribe(produtos => this.resultados.set(produtos));
```

Fluxo:
1. Extrai o termo (`map`).  
2. Marca loading (`tap`).  
3. Cancela busca anterior e chama API (`switchMap`).  
4. Trata erro e retorna `[]` (`catchError`).  
5. Finaliza loading (`tap`).  
6. Atualiza resultados (`subscribe`).  

---

## 6) Boas práticas
1. Use `map` para transformação pura de valores.  
2. Use `tap` apenas para efeitos colaterais (logs, spinners).  
3. Use `switchMap` em requisições encadeadas e cenários onde apenas o **último valor** importa.  
4. Sempre trate erros com `catchError`, devolvendo Observable válido (fallback).  
5. Encadeie operadores em ordem lógica → `map` antes de `switchMap`, `tap` para logs, `catchError` no nível certo.  
6. Combine com `finalize()` quando precisar **limpar recursos** independentemente de sucesso/erro.  

---

✅ **Resumo**
- `map` → transforma valores.  
- `tap` → efeitos colaterais (sem alterar valores).  
- `switchMap` → troca para novo fluxo, descartando o anterior.  
- `catchError` → trata erros e retorna fallback.  
Dominar esses quatro operadores cobre **90% dos casos práticos** em Angular com RxJS.

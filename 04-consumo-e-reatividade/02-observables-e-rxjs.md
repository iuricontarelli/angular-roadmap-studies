## 📌 Observables e RxJS (fundamentos práticos)

**Observables** representam fluxos assíncronos de valores ao longo do tempo (0..N valores).  
**RxJS** é a biblioteca usada pelo Angular para criar, transformar e combinar esses fluxos.

---

## 1) Quando usar Observables?
- Requisições HTTP (`HttpClient` retorna `Observable`).
- Eventos do usuário (cliques, digitação).
- WebSocket/Server‑Sent Events (stream contínuo).
- Timers, intervalos e tarefas assíncronas.
- Estados reativos (com `Subject`/`BehaviorSubject`).

---

## 2) Criando Observables

### 2.1 `of`, `from` (criação rápida)
```ts
import { of, from } from 'rxjs';

const fluxoSimples$ = of(1, 2, 3);          // emite 1,2,3 e completa
const dePromessa$  = from(fetch('/api'));   // converte Promise em Observable
```

### 2.2 `new Observable` (manual)
```ts
import { Observable } from 'rxjs';

const tempo$ = new Observable<number>((inscritor) => {
  const id = setInterval(() => inscritor.next(Date.now()), 1000);
  return () => clearInterval(id); // teardown (executa no unsubscribe)
});
```

---

## 3) Assinando e cancelando
Para consumir, fazemos `subscribe()`. **Cancele** ao destruir o componente para evitar vazamentos.
```ts
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-exemplo',
  template: `<!-- ... -->`
})
export class ExemploComponent implements OnDestroy {
  private sub?: Subscription;

  iniciar(obs$: Observable<any>) {
    this.sub = obs$.subscribe({
      next: (v) => console.log('valor:', v),
      error: (e) => console.error('erro:', e),
      complete: () => console.log('fim')
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
```

No Angular moderno, prefira **`AsyncPipe`** no template ou utilitários do pacote `@angular/core/rxjs-interop`:

```ts
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { inject, signal } from '@angular/core';

// Em serviços/componentes:
valor = toSignal(fluxo$, { initialValue: 0 }); // converte Observable -> Signal (sem unsubscribe manual)

// Ou em subscribe com auto‑unsubscribe
fluxo$.pipe(takeUntilDestroyed()).subscribe(v => {/* ... */});
```

---

## 4) Frio vs Quente (Cold vs Hot)
- **Cold**: cada `subscribe()` **refaz** a fonte (ex.: `HttpClient`, `of`, `from`).  
- **Hot**: a fonte é **compartilhada** (ex.: eventos de DOM, `Subject`). Novos inscritos **pegam o fluxo em andamento**.

Para compartilhar um fluxo cold entre vários assinantes, use **`shareReplay`**:
```ts
import { shareReplay } from 'rxjs/operators';

dados$ = this.http.get('/api/produtos').pipe(
  shareReplay(1) // cache da última emissão, evita refazer a chamada para novos subscribers
);
```

> Em HTTP idempotente, `shareReplay(1)` é comum; invalide/cacheie com critério.

---

## 5) Observable x Promise (quando usar)
- **Observable**: múltiplos valores, cancelável, operadores poderosos (mapear, combinar, filtrar). Ideal para streams contínuos e UI reativa.
- **Promise**: um único valor, não cancelável nativamente, mais simples. Útil para inicializações pontuais.

No Angular, **prefira Observable** para integrações e UI reativa.

---

## 6) Combinando fluxos (visão geral)
Exemplos comuns (detalhados no próximo tópico de operadores):
```ts
import { map, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fromEvent, of } from 'rxjs';

// Busca com debounce
busca$ = fromEvent<HTMLInputElement>(inputRef, 'input').pipe(
  map(e => (e.target as HTMLInputElement).value),
  debounceTime(300),
  distinctUntilChanged(),
  switchMap((termo) => termo ? this.api.buscar(termo) : of([]))
);
```

---

## 7) Subjects (panorama rápido)
- **Subject**: multicast manual (você emite com `.next()`).
- **BehaviorSubject**: igual ao Subject, mas **guarda o último valor** (ótimo para estado).
- **ReplaySubject**: reenvia **N** valores anteriores aos novos assinantes.

Exemplo simples com BehaviorSubject (estado global leve):
```ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TemaService {
  private _tema$ = new BehaviorSubject<'claro'|'escuro'>('claro');
  tema$ = this._tema$.asObservable();

  alternar() {
    this._tema$.next(this._tema$.value === 'claro' ? 'escuro' : 'claro');
  }
}
```

---

## 8) Boas práticas
1. **Evite `subscribe()` em cascata** → prefira **operadores** (`switchMap`, `map`, etc.).
2. Use `AsyncPipe` no template para lidar com subscribe/unsubscribe automaticamente.
3. Se precisar de estado, prefira **BehaviorSubject** ou **Signals** (`toSignal()`).
4. Documente **tipos** (`Observable<T>`) e **nomes semânticos** (sufixo `$` para observables).
5. Gerencie **erros** com `catchError`/`retry` (ver tópico de tratamento de erros).
6. Tenha **cuidado com concorrência** (ex.: `switchMap` cancela requisições anteriores).

---

✅ **Resumo**
Observables são a base da reatividade no Angular. Domine criação, assinatura, cancelamento e noções de **cold/hot**, **Subjects** e **compartilhamento**.  
Nos próximos tópicos, você vai combinar isso com **operadores** para fluxos mais poderosos.

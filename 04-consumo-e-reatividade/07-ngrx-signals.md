## 📌 NGRX Signals (opcional/avançado)

**NgRx Signals** é uma abordagem de *state management* baseada em **Signals** do Angular, fornecida pelo time do NgRx.  
A ideia é ter **lojas de estado (stores)** simples, com **API declarativa**, **reatividade por sinais** e integração tranquila com RxJS quando necessário.

> Indicado para: apps que precisam de **estado compartilhado** por feature, **derivações computadas**, *side-effects* controlados e **testabilidade** — sem a verbosidade de reducers/actions clássicos.

---

## 1) Instalação
```bash
npm i @ngrx/signals
```
> Em projetos com RxJS/effects, você pode continuar usando RxJS normalmente (e `@angular/core/rxjs-interop`).

---

## 2) Conceitos rápidos
- **Store**: objeto com **estado** (signals), **selectors** (`computed`) e **métodos** para alterar estado.
- **withState**: define estado inicial e tipagem.
- **withComputed**: adiciona *derivações* (signals computados).
- **withMethods**: agrupa métodos de escrita/efeitos.
- **patchState / setState**: alteram o estado da store de forma **imutável** e tipada.
- **withHooks**: *lifecycle* da store (ex.: inicializações).

---

## 3) Exemplo completo — `ProdutosStore`

**produtos.store.ts**
```ts
import { inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { ProdutosApiService, Produto } from '../data/produtos-api.service';
import { catchError, finalize, of } from 'rxjs';

type ProdutosState = {
  itens: Produto[];
  carregando: boolean;
  erro: string | null;
  filtro: string;
};

const estadoInicial: ProdutosState = {
  itens: [],
  carregando: false,
  erro: null,
  filtro: ''
};

export const ProdutosStore = signalStore(
  withState<ProdutosState>(estadoInicial),

  withComputed((store) => ({
    total: computed(() => store.itens().length),
    itensFiltrados: computed(() => {
      const q = store.filtro().trim().toLowerCase();
      return q
        ? store.itens().filter(p => p.nome.toLowerCase().includes(q))
        : store.itens();
    })
  })),

  withMethods((store) => {
    const api = inject(ProdutosApiService);

    return {
      setFiltro(valor: string) {
        patchState(store, { filtro: valor });
      },

      carregar() {
        patchState(store, { carregando: true, erro: null });
        api.listar().pipe(
          catchError(() => {
            patchState(store, { erro: 'Falha ao carregar produtos.' });
            return of<Produto[]>([]);
          }),
          finalize(() => patchState(store, { carregando: false }))
        ).subscribe((lista) => {
          patchState(store, { itens: lista });
        });
      },

      limpar() {
        patchState(store, { itens: [], filtro: '' });
      }
    };
  })
);
```

**Uso no componente**
```ts
import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { ProdutosStore } from './produtos.store';

@Component({
  standalone: true,
  selector: 'app-produtos',
  imports: [NgFor, AsyncPipe],
  template: `
    <input type="text" placeholder="filtrar..." (input)="store.setFiltro($any($event.target).value)" />

    <button (click)="store.carregar()" [disabled]="store.carregando()">Carregar</button>
    <button (click)="store.limpar()">Limpar</button>

    <p *ngIf="store.erro()">{{ store.erro() }}</p>
    <p>Total: {{ store.total() }}</p>

    <ul>
      <li *ngFor="let p of store.itensFiltrados()">
        {{ p.nome }} - {{ p.preco | currency:'BRL' }}
      </li>
    </ul>
  `,
  providers: [ProdutosStore] // escopo por componente/feature
})
export class ProdutosComponent {
  store = inject(ProdutosStore);
}
```

> Note como **estado e seletores são Signals**: acesse com `store.prop()` no template e no TS.

---

## 4) Integração com RxJS (quando preciso)
Você pode combinar **Signals** e **Observables** livremente:
- Converter **Observable → Signal** com `toSignal()` para hidratar estado.
- Converter **Signal → Observable** com `toObservable()` para fluxos externos.
- Usar operadores RxJS em métodos da store (como no `carregar()` do exemplo).

Exemplo (no componente/serviço):
```ts
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

// De signal (filtro) para observable e volta:
const filtro$ = toObservable(this.store.filtro);
const resultados = toSignal(
  filtro$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((q) => this.api.buscar(q))
  ),
  { initialValue: [] }
);
```

---

## 5) Organização e escopo
- **Por feature**: registre a store no `providers` do componente raiz da feature (escopo isolado).
- **Global**: registre a store no `AppComponent` (ou `bootstrap`) para escopo de toda a aplicação.
- Nomeie stores com sufixo `Store` e tipagens claras para o `State`.

---

## 6) Boas práticas
1. **Mutação só via métodos** da store (`withMethods`), mantendo a API coesa.
2. **Selectors computados** com `withComputed` para evitar lógica no template.
3. Use `patchState` para atualizações **imutáveis e parciais**; `setState` para *reset* completo.
4. **Escopo correto**: `providers: [MinhaStore]` por feature quando o estado não é global.
5. Integre com RxJS apenas quando necessário (timers, HTTP, websockets).

---

✅ **Resumo**
NgRx Signals oferece stores simples, reativos e tipados com Signals, reduzindo boilerplate.  
Perfeito para **estado por feature**, **derivações computadas** e **efeitos controlados**, mantendo integração com RxJS quando necessário.

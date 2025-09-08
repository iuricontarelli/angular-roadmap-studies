## 📌 Serviços Compartilhados no Angular

**Serviços compartilhados** centralizam lógica e **estado** que precisam ser usados por **múltiplos componentes/rotas**.  
Eles promovem **reuso**, **separação de responsabilidades** e **comunicação** entre partes desacopladas da aplicação.

---

### 🔹 Quando usar serviços compartilhados?
- Regras de negócio reutilizáveis (ex.: cálculo de frete, validação de NCM).
- **Estado global/por feature** (tema, usuário, carrinho, filtros).
- Comunicação entre componentes **sem parentesco direto** (fora de Input/Output).
- Acesso a **APIs** com `HttpClient` e **cache** de resultados.
- Cross-cutting concerns: **notificações**, **logs**, **telemetria**.

---

## 1) Padrões de **escopo** (onde o serviço vive)

### `providedIn: 'root'` (singleton global)
Disponível para toda a app (ideal para serviços de domínio amplo).
```ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TemaService {
  tema = signal<'claro' | 'escuro'>('claro');

  alternar() {
    this.tema.update(t => (t === 'claro' ? 'escuro' : 'claro'));
  }
}
```

Uso em qualquer componente (standalone):
```ts
import { Component, computed, inject } from '@angular/core';
import { TemaService } from '../shared/tema.service';

@Component({
  standalone: true,
  selector: 'app-toolbar',
  template: `
    <button (click)="temaSrv.alternar()">Alternar tema</button>
    <span>Tema atual: {{ temaAtual() }}</span>
  `
})
export class ToolbarComponent {
  temaSrv = inject(TemaService);
  temaAtual = computed(() => this.temaSrv.tema());
}
```

---

### Escopo por **feature** (lazy) — providers na rota
Cria instância **isolada** por conjunto de rotas (ótimo para áreas independentes).
```ts
// admin.routes.ts
import { Routes } from '@angular/router';
import { AdminHomeComponent } from './admin-home.component';
import { RelatoriosService } from './relatorios.service';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminHomeComponent,
    providers: [RelatoriosService] // escopo da feature "admin"
  }
];
```

---

### `providedIn: 'any'`
Cria uma nova instância **por injetor** (útil em libs ou quando cada lazy feature precisa da sua).
```ts
@Injectable({ providedIn: 'any' })
export class FiltroService { /* ... */ }
```

---

## 2) Compartilhando **estado**: RxJS vs Signals

### Com **RxJS** (`BehaviorSubject`)
```ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ItemCarrinho { id: number; nome: string; preco: number; qtd: number; }

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private _itens$ = new BehaviorSubject<ItemCarrinho[]>([]);
  readonly itens$ = this._itens$.asObservable();

  adicionar(item: ItemCarrinho) {
    const atual = this._itens$.value;
    const idx = atual.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      atual[idx] = { ...atual[idx], qtd: atual[idx].qtd + item.qtd };
      this._itens$.next([...atual]);
    } else {
      this._itens$.next([...atual, item]);
    }
  }

  limpar() { this._itens$.next([]); }
}
```

Uso no componente (com unsubscribe automático):
```ts
import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CarrinhoService } from './carrinho.service';

@Component({
  standalone: true,
  selector: 'app-carrinho',
  template: `
    <h3>Itens</h3>
    <div *ngFor="let i of itens()"> {{ i.nome }} ({{ i.qtd }}) </div>
  `
})
export class CarrinhoComponent implements OnInit {
  private carrinho = inject(CarrinhoService);
  itens = signal<any[]>([]);

  ngOnInit() {
    this.carrinho.itens$
      .pipe(takeUntilDestroyed())
      .subscribe(v => this.itens.set(v));
    // Ou: this.itens = toSignal(this.carrinho.itens$, { initialValue: [] });
  }
}
```

### Com **Signals** (Angular 17+)
```ts
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PreferenciasService {
  tema = signal<'claro' | 'escuro'>('claro');
  fonte = signal<number>(14);

  descricao = computed(() => `${this.tema()} - ${this.fonte()}px`);

  setTema(t: 'claro' | 'escuro') { this.tema.set(t); }
  setFonte(px: number) { this.fonte.set(px); }
}
```

---

## 3) Serviços de **API** (HttpClient) + tipagem
```ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Produto { id: number; nome: string; preco: number; }

@Injectable({ providedIn: 'root' })
export class ProdutosApi {
  private http = inject(HttpClient);
  private baseUrl = '/api/produtos';

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/${id}`);
  }
}
```

Uso:
```ts
import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { ProdutosApi } from './produtos.api';

@Component({
  standalone: true,
  selector: 'app-lista-produtos',
  imports: [AsyncPipe, NgFor],
  template: `
    <ul>
      <li *ngFor="let p of produtos$ | async">
        {{ p.nome }} - {{ p.preco | currency:'BRL' }}
      </li>
    </ul>
  `
})
export class ListaProdutosComponent {
  private api = inject(ProdutosApi);
  produtos$ = this.api.listar();
}
```

---

## 4) Comunicação desacoplada: **Event Bus** simples
Para eventos app-wide sem acoplamento entre emissores/assinantes.
```ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type EventoApp = { tipo: 'LOGIN' } | { tipo: 'LOGOUT' } | { tipo: 'ERRO'; msg: string };

@Injectable({ providedIn: 'root' })
export class EventBusService {
  private canal$ = new Subject<EventoApp>();
  eventos$ = this.canal$.asObservable();

  emitir(e: EventoApp) { this.canal$.next(e); }
}
```

Uso:
```ts
// Em qualquer lugar
bus.emitir({ tipo: 'ERRO', msg: 'Falha ao salvar' });

// Em outro componente/serviço
bus.eventos$.subscribe(e => { /* tratar centralmente */ });
```

---

## 5) Boas práticas
1. **Injeção com `inject()`** (Angular moderno) em vez de `constructor` quando fizer sentido.
2. Defina o **escopo correto**: `root` para global, `providers` na rota/feature para isolar estado.
3. **Evite singletons super genéricos**: quebrem por domínio (`AuthService`, `ExtracaoService`, etc.).
4. Com RxJS, use **`takeUntilDestroyed()`** e/ou `AsyncPipe` para evitar vazamentos.
5. Separe **serviços de estado** (Signals/RxJS) de **serviços de API** (HttpClient).
6. Centralize **tipos/DTOs** e **mapeadores** para evitar `any` e duplicação.
7. Para **persistência** (tema, token), abstraia acesso a `localStorage` num serviço próprio.

---

✅ **Resumo**
Serviços compartilhados permitem **reutilizar lógica** e **sincronizar estado** entre componentes e features.  
Escolha o **escopo** adequado e uma estratégia de reatividade (**RxJS** ou **Signals**) coerente com a complexidade da aplicação.

## 📌 Otimizações de performance no Angular (`trackBy`, `ChangeDetectionStrategy`, etc.)

Este guia reúne práticas **diretas** para tornar sua UI mais rápida e econômica. Exemplos prontos para colar em projetos **standalone**.

---

## 1) `trackBy` em listas grandes (`*ngFor`)
Evita recriar DOM para itens que **não mudaram**, reduzindo custo de renderização e preservando estado de inputs/scroll.

```html
<li *ngFor="let pedido of pedidos(); trackBy: rastrearPedido">
  #{{ pedido.id }} - {{ pedido.cliente }} - {{ pedido.total | currency:'BRL' }}
</li>
```

```ts
import { Component, signal } from '@angular/core';

type Pedido = { id: number; cliente: string; total: number };

@Component({
  standalone: true,
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html'
})
export class PedidosComponent {
  pedidos = signal<Pedido[]>([]);

  // use ID estável do domínio
  rastrearPedido = (_: number, p: Pedido) => p.id;

  atualizarTotalDoPedido(id: number, novoTotal: number) {
    // atualizações imutáveis ajudam o Angular a detectar mudanças rapidamente
    this.pedidos.update(lista =>
      lista.map(p => p.id === id ? { ...p, total: novoTotal } : p)
    );
  }
}
```

**Dica:** `trackBy` baseado em **ID único** é o ideal. Evite usar índice do array.

---

## 2) `ChangeDetectionStrategy.OnPush`
Reduz verificações de mudança (CD) para **inputs/outputs**, **eventos do componente** e **streams assíncronos** (AsyncPipe/Signals).

```ts
import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-card-produto',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article>
      <h3>{{ produto().nome }}</h3>
      <p>{{ precoFormatado() }}</p>
    </article>
  `
})
export class CardProdutoComponent {
  produto = input.required<{ nome: string; preco: number }>();
  precoFormatado = computed(() => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.produto().preco));
}
```

**Boas práticas com OnPush**
- Preferir **imutabilidade** (`{ ...obj }`, `array.map/filter`) ao alterar estado.
- Evitar mutar objetos/arrays **in-place**.
- Usar `AsyncPipe` ou **Signals** no template (gatilham CD corretamente).

---

## 3) Deferrable Views — `@defer` (carregamento tardio de UI)
Adie renderizações pesadas (charts, tabelas) até que a seção esteja **visível** ou **interagida**.

```html
@defer (on viewport) {
  <chart-analitico />
} @placeholder {
  <p>Carregando gráfico…</p>
} @loading {
  <p>Preparando recursos…</p>
} @error {
  <p>Falha ao carregar o gráfico.</p>
}
```

Gatilhos comuns: `on viewport`, `on idle`, `on interaction`, `on timer(1000ms)`.

---

## 4) Lazy loading de **componentes** e **features**
- `loadComponent` para páginas isoladas.
- `loadChildren` para grupos de rotas.
- Combine com `@defer` para adiar partes da UI dentro da própria página.

```ts
export const routes = [
  { path: 'relatorios', loadComponent: () => import('./relatorios/relatorios.component').then(m => m.RelatoriosComponent) }
];
```

---

## 5) Streams eficientes (RxJS + Signals)
- **Evite** `subscribe()` manuais; prefira `AsyncPipe` ou `toSignal()`.
- **Debounce** inputs; **switchMap** para cancelar requisições antigas.
- **Cache** GET idempotente com `shareReplay(1)` (e invalidação controlada).

```ts
dados$ = this.http.get('/api/produtos').pipe(shareReplay(1)); // múltiplos consumidores sem refazer a chamada
```

```ts
import { toSignal } from '@angular/core/rxjs-interop';
produtos = toSignal(this.api.listar(), { initialValue: [] });
```

---

## 6) Virtual scroll para listas grandes
Use **CDK** para renderizar só o que está visível.

```html
<cdk-virtual-scroll-viewport itemSize="56" class="viewport">
  <div *cdkVirtualFor="let item of itens; trackBy: trackId">
    {{ item.nome }}
  </div>
</cdk-virtual-scroll-viewport>
```

```ts
import { ScrollingModule } from '@angular/cdk/scrolling';
// imports: [ScrollingModule]
trackId = (_: number, it: { id: number }) => it.id;
```
```css
.viewport { height: 60vh; width: 100%; }
```

---

## 7) Executar fora da zona quando não precisa de CD
Tarefas pesadas/timers que **não** afetam UI podem rodar fora da `NgZone`.

```ts
import { Component, NgZone } from '@angular/core';

export class PesadoComponent {
  constructor(private zone: NgZone) {}

  iniciarWorker() {
    this.zone.runOutsideAngular(() => {
      // simulação: loop pesado / web worker
      let soma = 0;
      for (let i = 0; i < 50_000_000; i++) soma += i;
      // Só volte para UI quando necessário
      this.zone.run(() => console.log('feito', soma));
    });
  }
}
```

---

## 8) Pipes **puros** e memoização leve
Pipes **puros** (default) só recalculam quando **inputs mudam por referência**—ótimos com OnPush.

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'brl', standalone: true, pure: true })
export class BrlPipe implements PipeTransform {
  transform(v: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  }
}
```

Para cálculos caros, considere **memoizar** por argumentos se fizer sentido.

---

## 9) Imagens e recursos
- `loading="lazy"` em `<img>` não crítica.
- Formatos modernos (`webp/avif`), tamanhos corretos, `width/height` definidos.
- Combine com **CDN** e cache HTTP.

```html
<img src="/assets/produto.webp" alt="Produto" width="640" height="480" loading="lazy">
```

---

## 10) Componentes de terceiros (PrimeNG) — dicas
- Tabelas: `virtualScroll`, `lazy` (server-side), `rows` e **`[trackBy]`**.
- Dialogs: instancie sob demanda; evite múltiplos `p-dialog` sempre abertos.
- Inputs: use `change`/`blur` quando possível em vez de `input` contínuo.

```html
<p-table
  [value]="produtos"
  [virtualScroll]="true"
  [rows]="50"
  [trackBy]="trackId">
</p-table>
```

---

## 11) Checklist rápido
- [ ] `trackBy` em **todo** `*ngFor` de entidade com ID.
- [ ] `OnPush` em componentes de lista/card/tabelas e uso de **imutabilidade**.
- [ ] `@defer` para partes pesadas fora da dobra/visibilidade.
- [ ] Lazy loading em rotas e componentes.
- [ ] Streams com `debounce`, `switchMap`, `shareReplay` e `toSignal()`.
- [ ] Virtual scroll para listas extensas.
- [ ] Tarefas sem UI em `runOutsideAngular`.
- [ ] Pipes puros; imagens otimizadas.
- [ ] Configurações específicas em bibliotecas (ex.: PrimeNG).

---

✅ **Resumo**
Combine **`trackBy`**, **OnPush**, **@defer**, **lazy loading**, **streams enxutos** e **virtual scroll** para reduzir trabalho de renderização e tráfego.  
Com pequenas mudanças estruturais e disciplina em **imutabilidade**, sua aplicação fica visivelmente mais rápida e estável.

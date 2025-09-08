## 📌 Comunicação entre Componentes no Angular (Input/Output)

A comunicação entre componentes no Angular acontece, principalmente, de **pai → filho** usando **`@Input`** (ou `input()` com Signals) e de **filho → pai** usando **`@Output`** (ou `output()` com Signals).  
A seguir estão as abordagens **clássicas** e as **modernas (Signals)** — recomendadas no Angular 17+ / 20.

---

## 1) Pai → Filho com **@Input** (clássico)

**filho.component.ts**
```ts
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-card-produto',
  template: `
    <article>
      <h3>{{ produto?.nome }}</h3>
      <p>Preço: {{ produto?.preco | currency:'BRL' }}</p>
    </article>
  `
})
export class CardProdutoComponent {
  @Input({ required: true }) produto!: { id: number; nome: string; preco: number };
}
```

**pai.component.ts**
```ts
import { Component } from '@angular/core';
import { CardProdutoComponent } from './card-produto.component';

@Component({
  standalone: true,
  selector: 'app-lista-produtos',
  imports: [CardProdutoComponent],
  template: `
    <app-card-produto *ngFor="let p of produtos" [produto]="p" />
  `
})
export class ListaProdutosComponent {
  produtos = [
    { id: 1, nome: 'Teclado', preco: 199.9 },
    { id: 2, nome: 'Mouse', preco: 99.9 }
  ];
}
```

### Dicas
- Use `@Input({ required: true })` para deixar **explícito** que o pai **deve** passar esse dado.
- Renomeie o **alias** se necessário: `@Input('dadosProduto') produto!:` permite o pai usar `[dadosProduto]` no template.

---

## 2) Filho → Pai com **@Output + EventEmitter** (clássico)

**filho.component.ts**
```ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-item-carrinho',
  template: `
    <div>
      {{ item.nome }} - {{ item.preco | currency:'BRL' }}
      <button (click)="remover.emit(item.id)">Remover</button>
    </div>
  `
})
export class ItemCarrinhoComponent {
  @Input({ required: true }) item!: { id: number; nome: string; preco: number };
  @Output() remover = new EventEmitter<number>();
}
```

**pai.component.ts**
```ts
import { Component } from '@angular/core';
import { ItemCarrinhoComponent } from './item-carrinho.component';

@Component({
  standalone: true,
  selector: 'app-carrinho',
  imports: [ItemCarrinhoComponent],
  template: `
    <app-item-carrinho
      *ngFor="let i of itens"
      [item]="i"
      (remover)="removerDoCarrinho($event)"
    />
  `
})
export class CarrinhoComponent {
  itens = [
    { id: 1, nome: 'Teclado', preco: 199.9 },
    { id: 2, nome: 'Mouse', preco: 99.9 }
  ];

  removerDoCarrinho(id: number) {
    this.itens = this.itens.filter(i => i.id !== id);
  }
}
```

---

## 3) 📣 Abordagem **moderna com Signals**: `input()` e `output()`

No Angular moderno, você pode usar **Signals** (`input()` e `output()`) ao invés de `@Input`/`@Output`.  
Isso torna os dados **reativos por padrão** e simplifica leitura e tipagem.

**filho-signals.component.ts**
```ts
import { Component, input, output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-quantidade-controle',
  template: `
    <div class="controle">
      <button (click)="diminuir()">-</button>
      <span>{{ quantidade() }}</span>
      <button (click)="aumentar()">+</button>
    </div>
  `,
  styles: [`.controle { display: inline-flex; gap: .5rem; align-items: center; }`]
})
export class QuantidadeControleComponent {
  // Pai -> Filho
  quantidade = input.required<number>(); // exige valor do pai

  // Filho -> Pai
  mudou = output<number>();

  aumentar() {
    const novo = this.quantidade() + 1;
    this.mudou.emit(novo);
  }

  diminuir() {
    const novo = Math.max(0, this.quantidade() - 1);
    this.mudou.emit(novo);
  }
}
```

**pai-signals.component.ts**
```ts
import { Component, signal } from '@angular/core';
import { QuantidadeControleComponent } from './quantidade-controle.component';

@Component({
  standalone: true,
  selector: 'app-produto-detalhe',
  imports: [QuantidadeControleComponent],
  template: `
    <h3>{{ nomeProduto() }}</h3>
    <app-quantidade-controle
      [quantidade]="qtd()"
      (mudou)="qtd.set($event)"
    />
    <p>Quantidade no carrinho: {{ qtd() }}</p>
  `
})
export class ProdutoDetalheComponent {
  nomeProduto = signal('Headset Gamer');
  qtd = signal(1);
}
```

---

## 4) 🔁 Two-way binding personalizado (banana-in-a-box)

### Abordagem clássica
Crie um par `@Input`/`@Output` com sufixo `Change` para habilitar `[(valor)]`.

**contador.component.ts**
```ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-contador',
  template: `
    <button (click)="alterar(-1)">-</button>
    <span>{{ valor }}</span>
    <button (click)="alterar(1)">+</button>
  `
})
export class ContadorComponent {
  @Input() valor = 0;
  @Output() valorChange = new EventEmitter<number>();

  alterar(delta: number) {
    this.valorChange.emit(this.valor + delta);
  }
}
```

**uso no pai**
```html
<app-contador [(valor)]="qtd"></app-contador>
```

### Abordagem moderna com `model()` (Signals)
`model()` cria **automaticamente** um par input/output compatível com `[(...)]`.

```ts
import { Component, model } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-contador-model',
  template: `
    <button (click)="valor.update(v => v - 1)">-</button>
    <span>{{ valor() }}</span>
    <button (click)="valor.update(v => v + 1)">+</button>
  `
})
export class ContadorModelComponent {
  valor = model(0); // permite usar [(valor)]
}
```

**uso no pai**
```html
<app-contador-model [(valor)]="qtd"></app-contador-model>
```

---

## 5) Boas práticas
1. **Prefira `input()/output()/model()`** em projetos novos (Angular 17+ / 20) pela integração com Signals.
2. Use `@Input({ required: true })` ou `input.required<T>()` para deixar a API do componente explícita.
3. Evite passar objetos muito grandes por Input se apenas alguns campos são usados → prefira **DTOs específicos**.
4. Para eventos, envie **payloads semânticos** (ex.: `{ id, acao }`) e **tipados**.
5. Documente a API do componente no próprio arquivo (comentários JSDoc) e mantenha **nomes descritivos**.
6. Combine com **ChangeDetectionStrategy.OnPush** em componentes muito renderizados para performance.

---

✅ **Resumo**
- **Pai → Filho**: `@Input` / `input()`  
- **Filho → Pai**: `@Output` / `output()`  
- **Two-way**: `@Input` + `@Output valorChange` **ou** `model()` (Signals)  
As APIs modernas com **Signals** simplificam e deixam a comunicação mais previsível e performática.

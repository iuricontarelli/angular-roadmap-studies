## 📌 Acessibilidade (A11Y) básica no Angular

Acessibilidade (A11Y) significa construir interfaces que **todas as pessoas** consigam usar, incluindo quem navega com **teclado**, **leitores de tela** ou possui **baixa visão**. Esta referência foca em práticas **práticas** e **diretas** para aplicar no dia a dia com Angular (e PrimeNG).

---

## 1) HTML semântico primeiro
Use elementos HTML **semânticos** para transmitir significado aos leitores de tela e melhorar a navegação.
```html
<header>…</header>
<nav aria-label="principal">…</nav>
<main id="conteudo">…</main>
<section aria-labelledby="titulo-secao">
  <h2 id="titulo-secao">Pedidos recentes</h2>
  …
</section>
<footer>…</footer>
```
**Dicas**
- Mantenha **hierarquia** de `<h1>`…`<h6>` consistente.
- Evite usar `<div>` para botões/links; prefira `<button>` e `<a>`.

---

## 2) Navegação por teclado (Tab/Shift+Tab/Enter/Espaço)
Todo conteúdo interativo deve ser **focável** e operável por teclado.
```html
<button (click)="salvar()">Salvar</button>
<a routerLink="/relatorios">Relatórios</a>
```
**Dicas**
- Evite `tabindex` positivo (`tabindex="1"` etc.). Use `tabindex="0"` apenas quando necessário tornar um elemento não interativo focável.
- Não remova foco com `outline: none;` sem fornecer **estilo de foco** visível.

---

## 3) Gestão de foco (rotas, diálogos, feedback)
Ao navegar entre páginas/rotas, mova o foco para o conteúdo principal; ao abrir diálogos, **prenda o foco** dentro do modal e retorne ao elemento de origem ao fechar.

### Pular para conteúdo (skip link)
```html
<a class="skip-link" href="#conteudo">Pular para conteúdo principal</a>
<main id="conteudo" tabindex="-1">…</main>
```
```css
.skip-link { position:absolute; left:-9999px; }
.skip-link:focus { left:0; top:0; background:#fff; padding:.5rem; }
```

### Foco ao mudar rota (ex.: em `AppComponent`)
```ts
import { Component, ElementRef, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `<main id="conteudo" tabindex="-1"><router-outlet /></main>`
})
export class AppComponent {
  private router = inject(Router);
  private host = inject(ElementRef<HTMLElement>);

  ngOnInit() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.host.nativeElement.querySelector<HTMLElement>('#conteudo')?.focus());
  }
}
```

---

## 4) Texto alternativo para imagens
- Imagens **informativas**: `alt="Descrição do conteúdo"`.
- Imagens **decorativas**: `alt=""` (vazio) e `role="presentation"` quando aplicável.
```html
<img src="produto.png" alt="Foto do produto Notebook X300, cor preta" />
<img src="linha-de-divisao.svg" alt="" role="presentation" />
```

---

## 5) Rótulos e instruções em formulários
Sempre associe **label** ao campo e descreva erros de forma clara.
```html
<label for="email">Email</label>
<input id="email" name="email" type="email" aria-describedby="email-ajuda" required />
<small id="email-ajuda">Use um email no formato nome@exemplo.com</small>

<!-- Mensagem de erro dinâmica -->
<div *ngIf="emailCtrl.invalid && emailCtrl.touched" role="alert" aria-live="assertive">
  <span *ngIf="emailCtrl.errors?.['required']">O email é obrigatório.</span>
  <span *ngIf="emailCtrl.errors?.['email']">Formato inválido.</span>
</div>
```

---

## 6) ARIA: use quando o HTML não basta
- `role`, `aria-*` **não substituem** HTML semântico.
- Exemplos úteis:
  - `role="alert"` + `aria-live="assertive"` para mensagens importantes.
  - `aria-expanded`, `aria-controls` em itens que expandem/colapsam.

### Exemplo: acordeão acessível
```html
<button
  aria-expanded="{{ aberto }}"
  aria-controls="secao1"
  (click)="aberto = !aberto">
  Detalhes do pedido
</button>
<div id="secao1" [hidden]="!aberto">
  … conteúdo …
</div>
```

---

## 7) Tabelas acessíveis
- Use `<table>`, `<thead>`, `<tbody>`, `<th scope="col|row">`.
- Forneça **legenda** com `<caption>` e resumos quando necessário.
```html
<table>
  <caption>Pedidos do mês</caption>
  <thead>
    <tr><th scope="col">Nº</th><th scope="col">Cliente</th><th scope="col">Total</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">101</th><td>Maria</td><td>R$ 250,00</td></tr>
  </tbody>
</table>
```

---

## 8) Contraste de cores e foco visível
- Garanta **contraste mínimo 4.5:1** para texto normal (WCAG AA).
- Mostre **estilo de foco** claro (ex.: borda/halo) em elementos interativos.
```css
button:focus, a:focus { outline: 2px solid #005fcc; outline-offset: 2px; }
```

---

## 9) Componentes de terceiros (PrimeNG)
- Habilite **acessibilidade** nativa quando disponível (ex.: `appendTo="body"` em Dialog para evitar recorte/stacking, `modal="true"` e `focusTrap`).
- Use atributos como `aria-label`, `aria-labelledby`, `inputId` em componentes de formulário para manter a associação label–input.
```html
<p-inputText inputId="busca" [(ngModel)]="termo" placeholder="Buscar" />
<label for="busca">Buscar</label>

<p-dialog
  header="Detalhes"
  [modal]="true"
  [draggable]="false"
  [resizable]="false"
  [focusOnShow]="true">
  …
</p-dialog>
```

---

## 10) Teste com ferramentas
- **Teclado**: percorra toda a tela apenas com teclado.
- **Leitores de tela**: NVDA (Windows), VoiceOver (macOS).
- **Extensões**: Axe DevTools, Lighthouse (Chrome) → verifique contraste, landmarks, nomes acessíveis.

---

## 11) Padrões comuns prontos para colar

### Link “voltar ao topo” (visível no foco)
```html
<a href="#topo" class="skip-link">Voltar ao topo</a>
```

### Região de mensagens ao usuário (live region)
```html
<div role="status" aria-live="polite">{{ mensagem() }}</div>
```

### Botão com rótulo acessível (ícone)
```html
<button aria-label="Abrir menu principal">
  <i class="pi pi-bars" aria-hidden="true"></i>
</button>
```

---

## 12) Checklist rápido
- [ ] Estrutura semântica (`header/nav/main/section/footer`).
- [ ] Ordem de tabulação lógica e foco visível.
- [ ] Formulários com `label` e mensagens com `role="alert"/aria-live`.
- [ ] Imagens com `alt` adequado.
- [ ] Tabelas com `th`/`scope`/`caption`.
- [ ] Componentes de terceiros configurados para A11Y.
- [ ] Testado com teclado + ferramentas (Axe/Lighthouse).

---

✅ **Resumo**
A base de A11Y é **HTML semântico**, **foco e teclado**, **rótulos claros**, **feedbacks audíveis** e **contraste adequado**.  
Com Angular/PrimeNG, complemente com **gestão de foco**, **atributos ARIA** quando preciso e **testes práticos**.

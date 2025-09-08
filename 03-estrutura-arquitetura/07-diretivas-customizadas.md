## 📌 Diretivas Customizadas no Angular

**Diretivas** são classes que permitem **alterar aparência, comportamento ou estrutura** de elementos no template.  
Existem dois tipos principais que você criará no dia a dia:

- **Atributo**: modifica aparência/comportamento sem alterar a árvore do DOM (ex.: `[appDestaque]`).
- **Estrutural**: adiciona/remove elementos do DOM (ex.: `*appSe`, `*ngIf`).

No Angular moderno, crie diretivas **standalone** (`standalone: true`).

---

## 1) Diretiva de **Atributo** (estilo/comportamento)

### Exemplo: destacar elemento ao passar o mouse
```ts
import { Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDestaque]',
  standalone: true
})
export class DestaqueDirective {
  @Input('appDestaque') cor = '#fffbcc'; // permite [appDestaque]="'#e3f2fd'"

  @HostBinding('style.transition') transition = 'background-color .2s ease';
  @HostBinding('style.backgroundColor') bg?: string;

  constructor(private el: ElementRef<HTMLElement>) {}

  @HostListener('mouseenter') onEnter() {
    this.bg = this.cor || '#fffbcc';
  }

  @HostListener('mouseleave') onLeave() {
    this.bg = undefined;
  }
}
```

**Uso no template:**
```html
<p [appDestaque]="'#e8f5e9'">Passe o mouse aqui</p>
<p appDestaque>Com valor padrão</p>
```

### Dicas
- Prefira **`@HostBinding`** para refletir estados no host ao invés de manipular DOM manualmente.
- Use **`@Input`** para tornar a diretiva configurável.

---

## 2) Diretiva **Estrutural** (adiciona/remove do DOM)

### Exemplo: `*appSe` (semelhante ao `*ngIf`)

```ts
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appSe]',
  standalone: true
})
export class SeDirective {
  private condicao = false;

  constructor(
    private template: TemplateRef<unknown>,
    private view: ViewContainerRef
  ) {}

  @Input() set appSe(valor: boolean) {
    this.condicao = Boolean(valor);
    this.view.clear();
    if (this.condicao) {
      this.view.createEmbeddedView(this.template);
    }
  }
}
```

**Uso no template:**
```html
<p *appSe="usuarioLogado">Bem-vindo(a)!</p>
```

### Exemplo com `else` via `ng-template`
Crie uma segunda diretiva para suportar `else` (opcional) **ou** use `*ngIf` com `else` quando possível. Para simplicidade, normalmente mantemos apenas a condição principal e deixamos `else` para `*ngIf`.

---

## 3) Passando **contexto** para a view (diretivas estruturais avançadas)

Às vezes você quer expor dados para dentro do bloco da diretiva.

```ts
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

type ContextoDeVezes<T = unknown> = {
  $implicit: number; // valor padrão acessado como let valor
  indice: number;    // nomeado
};

@Directive({
  selector: '[appVezes]',
  standalone: true
})
export class VezesDirective {
  constructor(
    private template: TemplateRef<ContextoDeVezes>,
    private view: ViewContainerRef
  ) {}

  @Input() set appVezes(quantidade: number) {
    this.view.clear();
    for (let i = 0; i < quantidade; i++) {
      const contexto: ContextoDeVezes = { $implicit: i + 1, indice: i };
      this.view.createEmbeddedView(this.template, contexto);
    }
  }
}
```

**Uso no template:**
```html
<div *appVezes="3; let n; let i = indice">
  Renderização nº {{ n }} (índice {{ i }})
</div>
```

> Repare em **`$implicit`**: permite `let n` sem nomear a propriedade.

---

## 4) Tornando a diretiva **reutilizável** e **descoberta**

- Exporte um alias com `exportAs` quando fizer sentido (para acesso via `#ref="alias"`).
- Documente inputs e comportamento com **JSDoc** no arquivo da diretiva.
- Publique em uma **pasta/feature** coesa (ex.: `shared/directives`).

```ts
import { Directive, HostBinding } from '@angular/core';

/** Adiciona aria-disabled e classe utilitária quando desativado */
@Directive({
  selector: '[appDisabledStyle]',
  exportAs: 'disabledStyle',
  standalone: true
})
export class DisabledStyleDirective {
  @HostBinding('attr.aria-disabled') aria = true;
  @HostBinding('class.is-disabled') classe = true;
}
```

Uso:
```html
<button appDisabledStyle #ds="disabledStyle">Salvar</button>
```

---

## 5) Organização recomendada de **pastas/arquivos**

```
src/app/shared/directives/
 ├── destaque.directive.ts        // atributo
 ├── se.directive.ts              // estrutural simples
 ├── vezes.directive.ts           // estrutural com contexto
 └── index.ts                     // barrel (exporta todas as diretivas)
```

**index.ts**
```ts
export * from './destaque.directive';
export * from './se.directive';
export * from './vezes.directive';
```

No componente que usa:
```ts
import { Component } from '@angular/core';
import { DestaqueDirective } from '../shared/directives/destaque.directive';
import { SeDirective } from '../shared/directives/se.directive';
import { VezesDirective } from '../shared/directives/vezes.directive';

@Component({
  standalone: true,
  selector: 'app-exemplo',
  imports: [DestaqueDirective, SeDirective, VezesDirective],
  template: `
    <p appDestaque>Teste</p>
    <p *appSe="true">Mostra</p>
    <div *appVezes="2; let n">Bloco {{ n }}</div>
  `
})
export class ExemploComponent {}
```

---

## 6) Boas práticas
1. **Standalone** sempre: `standalone: true` nas diretivas novas.
2. Prefira **HostBinding/HostListener** a manipular DOM diretamente.
3. Evite lógicas pesadas em diretivas; mantenha-as **enxutas e específicas**.
4. Para diretivas estruturais, **limpe** a view (`view.clear()`) antes de reconstruir.
5. Tipos claros para contexto (`$implicit`, propriedades nomeadas) e **nomes semânticos**.
6. Crie um **barrel (`index.ts`)** por pasta para facilitar imports.
7. Teste cenários de destruição/recriação e condições limítrofes (0, null, undefined).

---

✅ **Resumo**
- **Atributo**: altera estilo/comportamento do elemento **sem** mudar a estrutura do DOM.  
- **Estrutural**: adiciona/remove elementos do DOM com `TemplateRef` e `ViewContainerRef`.  
- No Angular moderno, use diretivas **standalone** e priorize **HostBinding/HostListener** para clareza e performance.

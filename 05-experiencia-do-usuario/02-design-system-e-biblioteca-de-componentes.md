## 📌 Design System / Biblioteca de Componentes (ex: PrimeNG)

Um **Design System (DS)** é um conjunto de padrões de **UI, componentes, tokens de design e boas práticas** que garantem **consistência**, **velocidade** e **qualidade** na evolução do produto.  
No Angular, você pode tanto **consumir** uma biblioteca (ex.: **PrimeNG**) quanto **encapsular** essa biblioteca em **componentes de design system** próprios (camada de abstração).

---

## 1) Pilares de um Design System
- **Tokens de design**: cores, espaçamentos, tipografia, sombras (ex.: `--cor-primaria`, `--radius-md`).  
- **Componentes**: botões, inputs, tabelas, dialog, toast, etc.  
- **Princípios de UX/A11Y**: foco visível, navegação por teclado, mensagens claras.  
- **Documentação**: exemplos, variações, guidelines de uso.  
- **Governança**: como evoluir/versão, PRs, depreciações.

### Tokens com CSS Custom Properties (exemplo)
```css
:root {
  --cor-primaria: #2563eb;
  --cor-primaria-contraste: #ffffff;
  --radius-md: 10px;
  --espaco-2: .5rem;
  --espaco-3: .75rem;
}
.dark {
  --cor-primaria: #60a5fa;
}
```

---

## 2) PrimeNG — visão geral
**PrimeNG** provê um kit amplo e maduro de componentes com temas prontos, ícones e utilitários:

- **Componentes**: `p-button`, `p-inputText`, `p-table`, `p-dialog`, `p-toast`, `p-tooltip`, etc.  
- **Temas**: Lara, Aura, Nora, etc. (CSS variables).  
- **Ícones**: **PrimeIcons** (`pi pi-...`).  
- **PrimeFlex**: utilitários de layout (grid, spacing, display).

### Instalação
```bash
npm i primeng primeicons primeflex
```

### Estilos globais
No `styles.css` (ou `styles.scss`):
```css
/* Tema (escolha 1) */
@import 'primeng/resources/themes/lara-light-blue/theme.css';
/* Núcleo */
@import 'primeng/resources/primeng.min.css';
/* Ícones */
@import 'primeicons/primeicons.css';
/* Utilitários (opcional) */
@import 'primeflex/primeflex.css';

/* Tokens do DS da aplicação sobrescrevendo variáveis do tema */
:root {
  --primary-500: #2563eb; /* lara: cor primária */
  --text-color: #111827;
  --border-radius: 10px; /* afeta muitos componentes */
}
```

> Temas modernos do PrimeNG usam **CSS variables**, facilitando personalização. Você pode alternar tema adicionando uma **classe** na `<html>` (ex.: `.dark`) e outro arquivo/escopo com overrides.

---

## 3) Uso básico (standalone)
```ts
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [ButtonModule, InputTextModule],
  template: `
    <div class="p-fluid">
      <label for="nome">Seu nome</label>
      <input pInputText id="nome" [(ngModel)]="nome" />
      <p-button label="Enviar" icon="pi pi-send" (onClick)="enviar()" />
    </div>
  `
})
export class HomeComponent {
  nome = '';
  enviar() {/* ... */}
}
```

---

## 4) Encapsulando o PrimeNG no seu **Design System**
Para manter consistência, crie **wrappers** que padronizam props/estilos e evitam espalhar API da lib pelo app.

### Exemplo: `BotaoPrimarioComponent`
```ts
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'ds-botao-primario',
  imports: [ButtonModule],
  template: `
    <p-button
      [label]="rotulo"
      [icon]="icone"
      [disabled]="desabilitado"
      styleClass="w-full md:w-auto"
      severity="primary"
      (onClick)="acao?.()"
    />
  `
})
export class BotaoPrimarioComponent {
  @Input({required: true}) rotulo!: string;
  @Input() icone?: string;
  @Input() desabilitado = false;
  @Input() acao?: () => void;
}
```

### Exemplo: `TabelaBasicaComponent` (padrão de tabela)
```ts
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  standalone: true,
  selector: 'ds-tabela-basica',
  imports: [TableModule],
  template: `
    <p-table
      [value]="dados"
      [paginator]="true"
      [rows]="10"
      [rowsPerPageOptions]="[10,25,50]"
      [responsiveLayout]="'scroll'"
      [tableStyle]="{'min-width':'40rem'}">
      <ng-content></ng-content>
    </p-table>
  `
})
export class TabelaBasicaComponent {
  @Input({required: true}) dados!: any[];
}
```
Uso:
```html
<ds-tabela-basica [dados]="produtos">
  <ng-template pTemplate="header">
    <tr>
      <th pSortableColumn="nome">Nome <p-sortIcon field="nome" /></th>
      <th>Preço</th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-p>
    <tr>
      <td>{{ p.nome }}</td>
      <td>{{ p.preco | currency:'BRL' }}</td>
    </tr>
  </ng-template>
</ds-tabela-basica>
```

> Benefício: se trocar PrimeNG por outra lib no futuro, você altera **apenas a camada DS**.

---

## 5) Theming e modo escuro
Aproveite CSS variables do tema para **modo escuro** sem reescrever componentes.

```ts
// tema.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TemaService {
  tema = signal<'claro'|'escuro'>('claro');
  alternar() {
    this.tema.update(t => t === 'claro' ? 'escuro' : 'claro');
    document.documentElement.classList.toggle('dark', this.tema() === 'escuro');
  }
}
```

```css
/* overrides adicionais para .dark se quiser */
.dark {
  --text-color: #e5e7eb;
  --surface-100: #111827;
  --surface-200: #1f2937;
}
```

---

## 6) Acessibilidade com PrimeNG
- Use `inputId`, `aria-label`/`aria-labelledby` e `aria-describedby` para associar rótulos.  
- Em `p-dialog`, configure `[modal]="true"`, `focusOnShow`, e preferir `appendTo="body"` para evitar clipping.  
- `p-table`: forneça **caption** e cabeçalhos semânticos; use `pSortableColumn` com ícone e rótulos acessíveis.

```html
<p-dialog header="Detalhes" [modal]="true" [focusOnShow]="true" [draggable]="false">
  <p>Conteúdo do diálogo…</p>
</p-dialog>
```

---

## 7) PrimeFlex — utilitários úteis
```html
<div class="grid">
  <div class="col-12 md:col-6 lg:col-4 p-3">Coluna</div>
  <div class="col-12 md:col-6 lg:col-8 p-3">Coluna</div>
</div>
```
- Classes responsivas (`md:`, `lg:`), `flex`, `gap-*`, `justify-content-*`, `align-items-*` agilizam layout.

---

## 8) Diretório e convenções sugeridas
```
src/app/shared/ui/            # Camada de DS (wrappers/ícones/helpers)
 ├── buttons/
 │   └── botao-primario.component.ts
 ├── tables/
 │   └── tabela-basica.component.ts
 ├── forms/
 │   ├── input-text.component.ts
 │   └── select.component.ts
 ├── overlays/
 │   └── dialog-padrao.component.ts
 └── index.ts                 # barrel exports
```
`index.ts`
```ts
export * from './buttons/botao-primario.component';
export * from './tables/tabela-basica.component';
export * from './forms/input-text.component';
export * from './overlays/dialog-padrao.component';
```

---

## 9) Performance e DX
- **Importe por componente** (standalone) ao invés de módulos globais com tudo.  
- Em tabelas grandes, use `virtualScroll`, `trackBy` e **paginação**.  
- Evite criar múltiplas instâncias de `p-dialog` desnecessariamente; reusar ajuda na performance.  
- Crie um **Theme Playground** (rota interna) para visualizar tokens/cores/estados.

---

## 10) Checklist prático
- [ ] Tokens de cor/espac/raio definidos como CSS variables.  
- [ ] Camada de DS com **wrappers** para componentes mais usados.  
- [ ] Integração de tema (claro/escuro) via classe na raiz.  
- [ ] A11Y configurada (labels, focus, aria).  
- [ ] PrimeFlex para layout/responsividade.  
- [ ] Documentação de uso (MD + exemplos).

---

✅ **Resumo**
Use **PrimeNG** para acelerar com um catálogo robusto e **encapsule** em uma camada de **Design System** própria para garantir consistência e independência da biblioteca.  
Com **tokens**, **wrappers**, **theming** e **boas práticas de A11Y/performance**, você constrói uma base sólida e escalável para o front-end.

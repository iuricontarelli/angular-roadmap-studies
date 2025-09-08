## 📌 Internacionalização no Angular com `@angular/localize`

A **internacionalização (i18n)** permite adaptar **textos**, **datas**, **números** e **moedas** para diferentes **idiomas** e **regiões**.  
No Angular moderno você pode usar:
- **Marcação i18n no template** (`i18n` + ICU) e **build por localidade** (arquivos XLIFF).
- **Tradução em tempo de execução** com `$localize` + `loadTranslations()` (JSON).

Abaixo estão os dois fluxos para você escolher conforme seu projeto.

---

## 1) Preparação do projeto

### 1.1 Instalar a lib de i18n
```bash
npm i @angular/localize
```

### 1.2 Registrar dados de localidade (datas, moeda, etc.)
No `main.ts`, registre o locale e defina o `LOCALE_ID`:
```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { AppComponent } from './app/app.component';

registerLocaleData(localePt); // habilita formatação pt (datas, moedas, etc.)

bootstrapApplication(AppComponent, {
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }]
});
```
> Isso afeta **pipes de data/número/moeda** (`date`, `currency`, `decimal`), entre outros.

---

## 2) Fluxo A — **Build por localidade** (XLIFF)

### 2.1 Marcar textos no **template** com `i18n`
```html
<h1 i18n="@@tituloHome">Bem-vindo</h1>

<!-- Com descrição e id customizado -->
<p i18n="Descrição curta do parágrafo@@introTexto">
  Este é um exemplo de internacionalização.
</p>

<!-- ICU para plural -->
<p i18n>Você tem {quantidade, plural, =0 {nenhuma mensagem} one {# mensagem} other {# mensagens}}</p>
```

### 2.2 Marcar textos no **TypeScript** com `$localize`
```ts
import '@angular/localize/init';

const titulo = $localize`:@@cabecalhoTitulo:Relatórios`;
console.log(titulo);
```

### 2.3 Extrair mensagens para XLIFF
```bash
ng extract-i18n --format xlf --output-path src/locale
```
Isso gera `messages.xlf` com os textos fonte.

### 2.4 Traduzir e referenciar no `angular.json`
Crie `src/locale/messages.pt-BR.xlf` traduzido e configure:
```jsonc
/* angular.json (trecho) */
"projects": {
  "app": {
    "i18n": {
      "sourceLocale": "en-US",
      "locales": {
        "pt-BR": "src/locale/messages.pt-BR.xlf"
      }
    },
    "architect": {
      "build": {
        "options": { "localize": true }
      }
    }
  }
}
```

### 2.5 Build por localidade
```bash
ng build --configuration=production --localize
# ou específico:
ng build --configuration=production --localize=pt-BR
```
O Angular gera **um pacote por localidade**.

**Prós**: strings estáticas traduzidas pelo compilador, ótimo para SEO.  
**Contras**: múltiplos artefatos por idioma (deploy por idioma).

---

## 3) Fluxo B — **Tempo de execução** com `$localize` + `loadTranslations()`

### 3.1 Estrutura de traduções (JSON)
Crie arquivos por idioma em `src/assets/i18n/*.json`:
```json
// src/assets/i18n/pt-BR.json
{
  "tituloHome": "Bem-vindo",
  "introTexto": "Este é um exemplo de internacionalização.",
  "mensagens.plural": "Você tem {quantidade, plural, =0 {nenhuma mensagem} one {# mensagem} other {# mensagens}}"
}
```

### 3.2 Carregar traduções antes do bootstrap
```ts
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { loadTranslations } from '@angular/localize';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { AppComponent } from './app/app.component';

async function bootstrap() {
  const locale = navigator.language || 'pt-BR';
  const short = locale.split('-')[0];

  // carrega JSON (ajuste o fallback conforme seu app)
  const resp = await fetch(`/assets/i18n/${locale}.json`).catch(() => null)
           || await fetch(`/assets/i18n/${short}.json`).catch(() => null);

  if (resp && resp.ok) {
    const dict = await resp.json();
    loadTranslations(dict); // registra as traduções
  }

  registerLocaleData(localePt);
  await bootstrapApplication(AppComponent, {
    providers: [{ provide: LOCALE_ID, useValue: locale }]
  });
}
bootstrap();
```

### 3.3 Usar `$localize` e ICU
```ts
import '@angular/localize/init';

const titulo = $localize`:@@tituloHome:Bem-vindo`;
const texto  = $localize`:@@introTexto:Este é um exemplo de internacionalização.`;

// ICU com parâmetro
const quantidade = 3;
const msg = $localize`:@@mensagens.plural:Você tem {quantidade, plural, =0 {nenhuma mensagem} one {# mensagem} other {# mensagens}}`;
```

### 3.4 No template, usar `i18n` ou binding de strings do TS
- Para **strings estáticas**, `i18n` funciona normalmente (serão substituídas pelo dicionário).  
- Para **dinâmicas** vindas do TS, atribua propriedades já traduzidas com `$localize`.

**Prós**: um único bundle; troca de idioma em runtime; útil para apps autenticadas.  
**Contras**: não melhora SEO de páginas estáticas; atenção ao *flicker* inicial (carregar JSON antes do bootstrap).

---

## 4) Formatação local‑aware (datas, moeda, número)
Com `LOCALE_ID` e `registerLocaleData` configurados, pipes já respeitam o locale:
```html
<p>Hoje: {{ hoje | date:'fullDate' }}</p>
<p>Preço: {{ 1999.9 | currency:'BRL' }}</p>
<p>Número: {{ 12345.6789 | number:'1.2-2' }}</p>
```

---

## 5) Teste rápido de troca de idioma (runtime)
```ts
// idioma.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IdiomaService {
  idioma = signal<'pt-BR'|'en-US'>('pt-BR');

  async trocar(id: 'pt-BR'|'en-US') {
    this.idioma.set(id);
    const dict = await (await fetch(`/assets/i18n/${id}.json`)).json();
    const { loadTranslations } = await import('@angular/localize');
    loadTranslations(dict);
    document.documentElement.lang = id; // ajuda A11Y
    location.reload(); // simples (recarrega com novas traduções)
  }
}
```

---

## 6) Boas práticas
1. **Escolha um fluxo** conforme o projeto: **build por localidade** (SEO/landing) ou **runtime** (SPA autenticada).  
2. Use **ICU** para plural/select em textos.  
3. Mantenha **IDs estáveis** (`@@id`) nas mensagens para não perder traduções.  
4. Centralize **tokens de data/moeda** com `LOCALE_ID` + `registerLocaleData`.  
5. Atualize atributo `lang` no `<html>` (`document.documentElement.lang = 'pt-BR'`).  
6. Padronize convenções de **chaves** e **pasta** (`/assets/i18n/`), e automatize extração/merge com scripts.  

---

✅ **Resumo**
- `@angular/localize` suporta **i18n via XLIFF** (build) e **runtime** com `$localize`.  
- Configure `LOCALE_ID` + `registerLocaleData` para formatação local‑aware.  
- Use `i18n` no template e `$localize` no TS com **ICU** para pluralização e texto dinâmico.

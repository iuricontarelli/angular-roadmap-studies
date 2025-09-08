## 📌 Shared Module vs Core Module no Angular

Ao organizar uma aplicação Angular de médio/grande porte, é comum separar recursos em **Shared** e **Core**.  
Apesar de que no Angular moderno (com componentes standalone) essa divisão ficou menos obrigatória, ainda é útil em projetos grandes para **clareza** e **manutenção**.

---

## 1) Shared Module (ou pasta `shared/`)
- Contém **artefatos reutilizáveis** em diferentes features.
- **Nunca** deve conter lógica de negócio.
- Pode ser uma pasta com diretivas, pipes e componentes comuns.

### Exemplos do que vai em **Shared**:
- **Componentes reutilizáveis**: botões, tabelas genéricas, modais.
- **Diretivas customizadas**: `[appDestaque]`, `[appSe]`.
- **Pipes** comuns: `capitalize`, `cpf`, `telefone`.
- **Utils**: funções/helpers.

### Estrutura sugerida:
```
src/app/shared/
 ├── components/
 │   ├── botao-salvar.component.ts
 │   └── tabela-generica.component.ts
 ├── directives/
 │   └── destaque.directive.ts
 ├── pipes/
 │   └── capitalize.pipe.ts
 └── utils/
     └── formatadores.ts
```

### Importando (com standalone)
Com standalone, basta importar diretamente no componente pai:
```ts
@Component({
  standalone: true,
  selector: 'app-exemplo',
  imports: [BotaoSalvarComponent, DestaqueDirective, CapitalizePipe],
  template: `
    <app-botao-salvar></app-botao-salvar>
    <p appDestaque>{{ 'angular' | capitalize }}</p>
  `
})
export class ExemploComponent {}
```

---

## 2) Core Module (ou pasta `core/`)
- Contém **serviços e recursos globais** usados em toda a aplicação.
- Deve ser importado **apenas uma vez** (no `AppComponent` ou `bootstrapApplication`).
- Centraliza lógica que **não pertence a uma feature específica**.

### Exemplos do que vai em **Core**:
- **Serviços globais**: autenticação (`AuthService`), tema, logger, interceptadores HTTP.
- **Guards** de rotas globais.
- **Configuração de providers** (API base URL, estratégias de preloading).
- **Layout principal** (ex.: `AppShellComponent`, `Navbar`, `Sidebar`).

### Estrutura sugerida:
```
src/app/core/
 ├── services/
 │   ├── auth.service.ts
 │   └── logger.service.ts
 ├── interceptors/
 │   └── auth.interceptor.ts
 ├── guards/
 │   └── auth.guard.ts
 └── layout/
     ├── navbar.component.ts
     └── sidebar.component.ts
```

### Uso de providers no Core
```ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  estaAutenticado() { return true; }
}
```

No `main.ts`:
```ts
bootstrapApplication(AppComponent, {
  providers: [
    { provide: 'API_URL', useValue: 'https://api.exemplo.com' }
  ]
});
```

---

## 3) Comparação resumida

| Característica     | Shared                         | Core                         |
|--------------------|--------------------------------|------------------------------|
| **Objetivo**       | Reuso de UI/utilidades         | Serviços globais e config    |
| **Escopo**         | Importado em várias features   | Importado uma única vez      |
| **Contém**         | Pipes, diretivas, componentes  | Serviços, guards, interceptores |
| **Lógica de negócio** | ❌ Nunca                     | ✅ Apenas se global           |

---

## 4) Boas práticas
1. Prefira **standalone** no Angular moderno → `shared/` e `core/` podem ser apenas **pastas**, sem módulos NgModule.
2. Coloque no **Shared** apenas itens **reutilizáveis**.  
3. Coloque no **Core** apenas serviços/configurações que devem existir **uma única vez**.  
4. Evite dependências cruzadas entre Shared e Core.  
5. Configure **aliases** no `tsconfig.json` (`@shared/*`, `@core/*`) para facilitar imports.

---

✅ **Resumo**
- **Shared**: reuso (UI, diretivas, pipes, utils).  
- **Core**: recursos globais (serviços, interceptores, layout principal).  
Mesmo com standalone, manter essa separação ajuda a organizar grandes projetos de forma clara e sustentável.

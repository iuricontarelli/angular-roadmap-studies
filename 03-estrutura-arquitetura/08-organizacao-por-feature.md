## 📌 Organização por Feature no Angular

A **organização por feature** é uma prática de arquitetura em Angular que estrutura o projeto em **módulos/pastas** baseados em **funcionalidades** (features) em vez de camadas técnicas.  
Isso melhora a **escalabilidade**, a **descoberta de código** e o **desenvolvimento paralelo** entre times.

---

## 1) Problema da organização por camadas técnicas
Estrutura tradicional (não recomendada para apps grandes):
```
src/app/
 ├── components/
 ├── services/
 ├── models/
 ├── pages/
 └── utils/
```
- Componentes relacionados ficam espalhados.  
- Dificulta navegação e manutenção.  
- Escala mal em times grandes.  

---

## 2) Organização por **feature**
Estruture cada **funcionalidade** em sua própria pasta, com componentes, serviços, rotas, modelos, testes, etc.

```
src/app/
 ├── features/
 │   ├── produtos/
 │   │   ├── pages/
 │   │   │   ├── lista-produtos.component.ts
 │   │   │   └── detalhe-produto.component.ts
 │   │   ├── services/
 │   │   │   └── produtos.service.ts
 │   │   ├── models/
 │   │   │   └── produto.model.ts
 │   │   ├── produtos.routes.ts
 │   │   └── index.ts
 │   ├── carrinho/
 │   │   ├── pages/
 │   │   ├── services/
 │   │   ├── models/
 │   │   └── carrinho.routes.ts
 │   └── usuarios/
 │       ├── pages/
 │       ├── services/
 │       └── usuarios.routes.ts
 └── shared/
     ├── components/
     ├── directives/
     ├── pipes/
     └── utils/
```

Vantagens:
- **Encapsulamento**: cada feature é quase um mini-módulo independente.  
- **Clareza**: fica óbvio onde modificar/adicionar algo.  
- **Escalabilidade**: times diferentes podem trabalhar em features diferentes sem conflito.  

---

## 3) Estrutura de rotas por feature
Cada feature tem suas rotas declaradas em `*.routes.ts`.

**produtos.routes.ts**
```ts
import { Routes } from '@angular/router';
import { ListaProdutosComponent } from './pages/lista-produtos.component';
import { DetalheProdutoComponent } from './pages/detalhe-produto.component';

export const PRODUTOS_ROUTES: Routes = [
  { path: '', component: ListaProdutosComponent },
  { path: ':id', component: DetalheProdutoComponent }
];
```

No `app.routes.ts`:
```ts
export const routes: Routes = [
  {
    path: 'produtos',
    loadChildren: () => import('./features/produtos/produtos.routes').then(m => m.PRODUTOS_ROUTES)
  },
  {
    path: 'carrinho',
    loadChildren: () => import('./features/carrinho/carrinho.routes').then(m => m.CARRINHO_ROUTES)
  }
];
```

---

## 4) Index.ts (barrel) por feature
Crie um `index.ts` em cada pasta para exportar componentes/serviços, facilitando imports.

**features/produtos/index.ts**
```ts
export * from './pages/lista-produtos.component';
export * from './pages/detalhe-produto.component';
export * from './services/produtos.service';
export * from './models/produto.model';
```

Uso:
```ts
import { ProdutosService } from '@app/features/produtos';
```

> Configure **paths** no `tsconfig.json` para suportar `@app/features/...` em vez de caminhos relativos longos.

---

## 5) Shared vs Core
- **Shared** → componentes, pipes e diretivas **reutilizáveis** em qualquer feature.  
- **Core** → serviços de **uso global** (ex.: Auth, Interceptadores, Layout principal).  

```
src/app/
 ├── core/
 │   ├── services/
 │   │   └── auth.service.ts
 │   ├── interceptors/
 │   └── core.module.ts (opcional em projetos modernos)
 └── shared/
     ├── components/
     ├── directives/
     ├── pipes/
     └── utils/
```

---

## 6) Boas práticas
1. **Organize por feature** sempre que a aplicação tiver mais que 1-2 telas.  
2. Dentro de cada feature, mantenha a mesma estrutura (`pages/`, `services/`, `models/`, `*.routes.ts`).  
3. Use **lazy loading** para features inteiras.  
4. Centralize reuso em `shared/`, sem lógica de negócio.  
5. Evite dependências cruzadas entre features → use **serviços compartilhados** no `core/` se necessário.  
6. Utilize `barrels (index.ts)` para melhorar a DX e evitar imports longos.  

---

✅ **Resumo**
- Organização por **feature** mantém o código modular e escalável.  
- Cada feature contém tudo o que precisa (componentes, serviços, rotas, modelos).  
- `shared/` = reuso; `core/` = serviços globais.  
Essa arquitetura facilita manutenção e crescimento de apps Angular grandes.

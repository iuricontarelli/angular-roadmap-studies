## 📌 Lazy Loading de Rotas no Angular

O **lazy loading** carrega partes da aplicação **sob demanda**, reduzindo o bundle inicial (tempo de primeiro carregamento) e melhorando a performance.  
No Angular moderno (standalone), fazemos lazy de **componentes** com `loadComponent` e de **conjuntos de rotas** com `loadChildren`.

---

### 🔹 Quando usar lazy loading?
- Áreas grandes ou pouco acessadas (ex.: **admin**, **relatórios**, **configurações**).
- Funcionalidades separadas por **feature**.
- Páginas protegidas que só usuários autenticados acessam.

---

### 🔹 Lazy de **um componente** (standalone) com `loadComponent`

**app.routes.ts**
```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'relatorios',
    loadComponent: () =>
      import('./features/relatorios/relatorios.component')
        .then(m => m.RelatoriosComponent)
  }
];
```

> O Angular criará um **chunk** separado para `relatorios.component` e o baixará somente quando a rota for acessada.

---

### 🔹 Lazy de **um grupo de rotas** com `loadChildren`

**app.routes.ts**
```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  }
];
```

**features/admin/admin.routes.ts**
```ts
import { Routes } from '@angular/router';
import { AdminHomeComponent } from './pages/admin-home.component';
import { UsuariosComponent } from './pages/usuarios.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: AdminHomeComponent },
  { path: 'usuarios', component: UsuariosComponent }
];
```

> Útil quando a feature tem **várias páginas**. Cada arquivo referenciado (componentes) também é carregado sob demanda.

---

### 🔹 Organização por **feature** (sugerida)

```
src/
└── app/
    ├── app.routes.ts
    └── features/
        ├── admin/
        │   ├── admin.routes.ts
        │   └── pages/
        │       ├── admin-home.component.ts
        │       └── usuarios.component.ts
        └── relatorios/
            └── relatorios.component.ts
```

- Cada feature mantém **rotas, componentes e assets** juntos.
- Facilita manutenção e **code splitting**.

---

### 🔹 Pré-carregamento (preloading) de rotas lazy

Você pode instruir o Angular a **precarregar** rotas lazy **após** o app inicializar, para navegação mais rápida sem prejudicar o TTI inicial.

**main.ts**
```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, PreloadAllModules, withPreloading } from '@angular/router';
import { routes } from './app.routes';
import { AppComponent } from './app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules))
  ]
});
```

Opções comuns:
- `withPreloading(PreloadAllModules)` → precarrega **todas** as rotas lazy quando o app fica ocioso.
- `withPreloading(NoPreloading)` (padrão) → **não** precarrega nada.
- **Pré-carregamento customizado**: você pode criar uma estratégia que só precarregue rotas com `data: { preload: true }`.

**Estratégia customizada (exemplo simplificado):**
```ts
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

export class SeletivaPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return route.data?.['preload'] ? load() : of(null);
  }
}
```

**main.ts (usando estratégia customizada):**
```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withPreloading } from '@angular/router';
import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { SeletivaPreloadingStrategy } from './shared/preloading.strategy';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withPreloading(SeletivaPreloadingStrategy))
  ]
});
```

E marque as rotas desejadas:
```ts
export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    data: { preload: true }
  }
];
```

---

### 🔹 Guards com rotas lazy (visão geral)

Mesmo com lazy, você pode proteger rotas usando **guards** (ex.: `canMatch` para evitar até o download do chunk se o usuário não tiver acesso).

```ts
import { Routes } from '@angular/router';
import { authCanMatchGuard } from './shared/guards/auth-can-match.guard';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canMatch: [authCanMatchGuard] // só carrega se puder combinar a rota
  }
];
```

**auth-can-match.guard.ts (exemplo funcional):**
```ts
import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authCanMatchGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.estaAutenticado()) {
    return true;
  }

  // bloqueia o match e redireciona sem carregar o chunk
  router.navigate(['/login']);
  return false;
};
```

---

### 📌 Boas práticas
1. **Comece pelo básico**: defina rotas principais; mova para lazy as áreas não críticas do fluxo inicial.
2. **Use `loadComponent`** para páginas isoladas; **`loadChildren`** para features com várias rotas.
3. **Combine com preloading** para UX mais fluida após o primeiro carregamento.
4. **Proteja com `canMatch`** quando a autorização deve impedir até o download do chunk.
5. **Nomeie pastas e rotas por feature** para facilitar manutenção e testes.

---

✅ **Resumo:**  
- Lazy loading reduz o bundle inicial e melhora performance.  
- `loadComponent` (componente standalone) e `loadChildren` (grupo de rotas) são as formas modernas.  
- Preloading e guards (`canMatch`) refinam a experiência e a segurança.

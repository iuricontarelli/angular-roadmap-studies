## 📌 Rotas protegidas com Guards no Angular

Os **guards** controlam o acesso às rotas. Eles verificam condições antes de permitir a navegação (ex.: autenticação, autorização por perfil, dados carregados).  
No Angular moderno (standalone), damos preferência a **guards funcionais** (`CanMatchFn`, `CanActivateFn`, etc.) usando `inject()` ao invés de classes.

---

### 🔹 Tipos principais de guards
- **`canMatch`**: impede que a rota **seja combinada** (match). Ideal para proteger **rotas lazy**, pois evita até o download do chunk quando o usuário não tem acesso.
- **`canActivate`**: executa ao **ativar** a rota. Útil para rotas já conhecidas/carregadas.
- **`canActivateChild`**: executa para **filhas** de uma rota.
- **`canDeactivate`**: confirma **saída** de uma rota (ex.: alertar se há formulário não salvo).
- **`resolve`**: **carrega dados** antes de ativar a rota (não é “guard” por si, mas integra o fluxo de navegação).
- **`canLoad`**: semelhante a `canMatch`, porém legado em cenários standalone; **prefira `canMatch`** para lazy loading.

> Regra prática: para **lazy loading**, priorize `canMatch`; para rotas já carregadas, `canActivate`.

---

### 🔹 Exemplo de `AuthService` (simples)
```ts
export class AuthService {
  private autenticado = false;
  private perfis: string[] = [];

  estaAutenticado(): boolean {
    return this.autenticado;
  }

  possuiPerfil(perfil: string): boolean {
    return this.perfis.includes(perfil);
  }

  // mocks de login
  logar(comPerfis: string[] = ['USER']) {
    this.autenticado = true;
    this.perfis = comPerfis;
  }

  sair() {
    this.autenticado = false;
    this.perfis = [];
  }
}
```

---

### 🔹 Guard funcional com `canMatch` (bloqueia até o download do chunk)
Bloqueia acesso à rota `admin` caso o usuário não esteja autenticado **ou** não tenha o perfil exigido.

```ts
import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

export const authPerfilCanMatchGuard: CanMatchFn = (route, segments) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const perfilNecessario = route.data?.['perfil'] as string | undefined;

  if (auth.estaAutenticado() && (!perfilNecessario || auth.possuiPerfil(perfilNecessario))) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { redirecionar: '/' + segments.map(s => s.path).join('/') } });
  return false;
};
```

**Uso na rota lazy com `loadChildren`:**
```ts
import { Routes } from '@angular/router';
import { authPerfilCanMatchGuard } from './shared/guards/auth-perfil-canmatch.guard';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canMatch: [authPerfilCanMatchGuard],
    data: { perfil: 'ADMIN' }
  }
];
```

---

### 🔹 Guard funcional com `canActivate` (protege rota já carregada)
```ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

export const authCanActivateGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.estaAutenticado()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
```

**Uso:**
```ts
import { Routes } from '@angular/router';
import { PaginaProtegidaComponent } from './pages/pagina-protegida.component';

export const routes: Routes = [
  { path: 'area', component: PaginaProtegidaComponent, canActivate: [authCanActivateGuard] }
];
```

---

### 🔹 `canActivateChild` (toda a seção protegida)
```ts
import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

export const authCanActivateChildGuard: CanActivateChildFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.estaAutenticado()) return true;
  router.navigate(['/login']);
  return false;
};
```

**Rotas filhas protegidas:**
```ts
export const routes: Routes = [
  {
    path: 'conta',
    canActivateChild: [authCanActivateChildGuard],
    children: [
      { path: 'perfil', component: PerfilComponent },
      { path: 'historico', component: HistoricoComponent }
    ]
  }
];
```

---

### 🔹 `canDeactivate` (confirmar saída se houver alterações não salvas)
```ts
import { CanDeactivateFn } from '@angular/router';

export interface ComponenteComGuardSaida {
  podeSair(): boolean;
}

export const confirmarSaidaGuard: CanDeactivateFn<ComponenteComGuardSaida> = (comp) => {
  return comp.podeSair() || confirm('Existem alterações não salvas. Deseja sair?');
};
```

**Uso no componente e rota:**
```ts
export class EditarPerfilComponent implements ComponenteComGuardSaida {
  alterado = false;
  podeSair(): boolean { return !this.alterado; }
}
```
```ts
{ path: 'editar', component: EditarPerfilComponent, canDeactivate: [confirmarSaidaGuard] }
```

---

### 🔹 `resolve` (carregar dados antes de entrar na rota)
```ts
import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { UsuarioService } from './shared/services/usuario.service';

export const usuarioResolve: ResolveFn<any> = (route) => {
  const svc = inject(UsuarioService);
  const id = route.paramMap.get('id')!;
  return svc.buscarPorId(id); // pode retornar Observable/Promise/valor
};
```

**Definição de rota:**
```ts
{ path: 'usuario/:id', component: UsuarioDetalheComponent, resolve: { usuario: usuarioResolve } }
```

No componente, acesse via `ActivatedRoute.data`:
```ts
this.route.data.subscribe(dados => this.usuario = dados['usuario']);
```

---

### 🔹 Dicas e boas práticas
1. **Prefira `canMatch`** para rotas lazy (evita baixar o chunk sem necessidade).
2. **Mantenha os guards coesos** (uma responsabilidade clara: autenticação, perfil, confirmação de saída…).
3. **Use `data` nas rotas** (`data: { perfil: 'ADMIN' }`) para configurar comportamento sem hardcode.
4. **Evite chamadas HTTP pesadas** diretamente no guard; prefira caches/serviços ou `resolve` para pré-carregar.
5. **Redirecione de forma consistente** (ex.: para `/login` com `queryParams` para pós-login).
6. **Teste os guards** isoladamente (retornos boolean/UrlTree) para garantir fluxos corretos.

---

✅ **Resumo:**  
- **Guards** controlam a navegação e segurança de rotas.  
- Use **`canMatch`** para lazy loading, **`canActivate`** para rotas já carregadas, **`canDeactivate`** para confirmar saída e **`resolve`** para dados prévios.  
- Centralize regras em serviços e configure perfis/flags via `data` nas rotas.

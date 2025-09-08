## 📌 Roteamento no Angular (Básico e Avançado)

O roteamento no Angular é responsável por definir **como navegar entre páginas e componentes** dentro da aplicação.  
Ele utiliza a biblioteca `@angular/router` para mapear **rotas** e carregar os componentes correspondentes.

---

### 🔹 Configuração básica de rotas
Criamos um arquivo `app.routes.ts` com as definições de rotas:

```ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { SobreComponent } from './sobre.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },       // rota raiz
  { path: 'sobre', component: SobreComponent }, // rota /sobre
  { path: '**', redirectTo: '' }                // rota coringa (404)
];
```

No `main.ts`:
```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AppComponent } from './app.component';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
```

No template `app.component.html` usamos o **router outlet**:
```html
<nav>
  <a routerLink="/">Início</a> |
  <a routerLink="/sobre">Sobre</a>
</nav>

<router-outlet></router-outlet>
```

---

### 🔹 Roteamento com parâmetros
Permite passar informações dinâmicas pela URL.

Definição de rota:
```ts
{ path: 'detalhe/:id', component: DetalheComponent }
```

Acessando no componente:
```ts
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-detalhe',
  template: `<p>ID recebido: {{ id }}</p>`
})
export class DetalheComponent {
  id: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id');
  }
}
```

Navegação com link:
```html
<a [routerLink]="['/detalhe', 10]">Ver detalhe do item 10</a>
```

---

### 🔹 Navegação programática
Podemos navegar entre rotas pelo código usando `Router`.

```ts
import { Router } from '@angular/router';

constructor(private router: Router) {}

irParaSobre() {
  this.router.navigate(['/sobre']);
}
```

---

### 🔹 Lazy Loading de rotas (carregamento sob demanda)
Melhora a performance carregando módulos/componentes apenas quando necessários.

Definição de rota com lazy loading:
```ts
export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  }
];
```

No `admin.routes.ts`:
```ts
import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: AdminComponent }
];
```

---

### 🔹 Rotas filhas (nested routes)
Permite criar hierarquia de rotas.

```ts
export const routes: Routes = [
  {
    path: 'usuarios',
    component: UsuariosComponent,
    children: [
      { path: ':id', component: UsuarioDetalheComponent },
      { path: ':id/editar', component: UsuarioEditarComponent }
    ]
  }
];
```

No `usuarios.component.html`:
```html
<h2>Lista de Usuários</h2>
<router-outlet></router-outlet>
```

---

### 📌 Boas práticas
1. Definir rotas em arquivos separados (`app.routes.ts`, `admin.routes.ts`).  
2. Usar `**` como última rota para tratar páginas não encontradas.  
3. Usar lazy loading para rotas de áreas específicas (ex.: admin, relatórios).  
4. Evitar lógica de negócio dentro de `ActivatedRoute`, preferindo serviços.  

---

✅ **Resumo:**  
- **Roteamento básico** → rotas simples, parâmetros e navegação programática.  
- **Roteamento avançado** → lazy loading, rotas filhas e organização modular.  
O roteamento é essencial para estruturar a aplicação Angular em múltiplas páginas de forma escalável.

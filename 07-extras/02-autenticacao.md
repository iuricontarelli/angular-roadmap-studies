## 📌 Autenticação: Token (JWT/OIDC) e Keycloak

Implemente **autenticação** segura e escalável via **JWT** (Bearer) ou **OIDC** com **Keycloak**.

---

## 1) Fluxo JWT simples (SPA + API)
1. Usuário envia credenciais para `/auth/login`.
2. API retorna **access_token** (+ opcional **refresh_token**).
3. SPA guarda token (preferencial **Memory**/**Session Storage**; evite LocalStorage para dados sensíveis).
4. Interceptador anexa `Authorization: Bearer <token>`.
5. Em 401/403 → redireciona para login/refresh.

### Interceptador de token
```ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  if (!token || req.headers.has('X-Skip-Auth')) return next(req);

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
```

### Refresh token (resumo)
- Em erro 401 por **token expirado**, tente `/auth/refresh` uma vez por janela (**mutex** para evitar tempestade de requests).
- Se falhar, **logout** limpo.

---

## 2) OIDC com Keycloak (Code Flow + PKCE)

### Instalação base
```bash
npm i keycloak-js
```

### Bootstrap simples
```ts
// keycloak-init.ts
import Keycloak from 'keycloak-js';

export const keycloak = new Keycloak({
  url: 'https://sso.exemplo.com/',
  realm: 'meu-reino',
  clientId: 'spa-angular'
});

export async function initKeycloak() {
  await keycloak.init({ onLoad: 'login-required', checkLoginIframe: false, pkceMethod: 'S256' });
  return keycloak;
}
```

```ts
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { initKeycloak, keycloak } from './keycloak-init';

await initKeycloak();
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([
      (req, next) => {
        const token = keycloak.token;
        return token ? next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })) : next(req);
      }
    ]))
  ]
});
```

### Guards de rota (roles)
```ts
export const roleCanMatchGuard: CanMatchFn = (route) => {
  const rolesNecessarias = route.data?.['roles'] as string[] | undefined;
  if (!rolesNecessarias) return true;
  return rolesNecessarias.some(r => keycloak.hasRealmRole(r));
};
```

---

## 3) Boas práticas
- **PKCE** sempre para SPAs com OIDC.
- **Renovar token** pró-ativo (ex.: 30s antes do expirar).
- Escopo **mínimo** de permissões (principle of least privilege).
- Armazenar apenas o **necessário** do perfil; dados sensíveis **no backend**.
- Auditoria/log de login/refresh/logout.

---

✅ **Resumo**: JWT é direto e eficaz; Keycloak entrega OIDC completo (SSO, roles, políticas). Sempre proteja rotas, renove tokens e trate 401/403 com UX clara.

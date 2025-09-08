## 📌 Variáveis de ambiente no Angular (`environment.ts`)

Use **environments** para separar configurações por ambiente (dev/homolog/prod).

---

## 1) Estrutura recomendada
```
src/environments/
 ├── environment.ts                # desenvolvimento
 ├── environment.development.ts    # (alias) usado por padrão
 ├── environment.staging.ts        # homolog
 └── environment.production.ts     # produção
```

**`environment.ts`**
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  featureFlags: {
    novaTabela: true
  }
};
```

**`environment.production.ts`**
```ts
export const environment = {
  production: true,
  apiUrl: 'https://api.suaempresa.com',
  featureFlags: {
    novaTabela: false
  }
};
```

No código:
```ts
import { environment } from '../environments/environment';
this.http.get(`${environment.apiUrl}/produtos`);
```

---

## 2) Substituição por configuração
No `angular.json`, configure **fileReplacements** ou use **configurações** com `ng build --configuration=production` para escolher os environments.

---

## 3) Injeção via **tokens** (alternativa moderna)
Crie um **InjectionToken** para config dinâmico, útil em SSR/SSG.

```ts
export type AppConfig = { apiUrl: string };
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

bootstrapApplication(AppComponent, {
  providers: [{ provide: APP_CONFIG, useValue: { apiUrl: '...' } }]
});
```

Uso:
```ts
const cfg = inject(APP_CONFIG);
this.http.get(`${cfg.apiUrl}/health`);
```

---

## 4) Valores secretos
- **Nunca** commitar segredos (tokens, chaves).  
- Em SSR/edge, leia segredos do **process.env** no servidor e repasse apenas o necessário ao browser.  
- Para SPA pura, avalie proxy de backend para mascarar segredos.

---

✅ **Resumo**: Environments mantêm seu código limpo por ambiente; para cenários avançados, use **InjectionToken** e SSR para valores dinâmicos/seguros.

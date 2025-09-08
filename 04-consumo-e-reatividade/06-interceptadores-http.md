## 📌 Interceptadores HTTP no Angular

**Interceptadores** permitem **interceptar, inspecionar, modificar** e **tratar** requisições e respostas HTTP de forma **centralizada**.  
No Angular moderno, use **interceptadores funcionais** (`HttpInterceptorFn`) com `provideHttpClient(withInterceptors([...]))`.

---

## 1) Registro (standalone) com `withInterceptors`

No `main.ts`:
```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { authTokenInterceptor } from './app/shared/http/auth-token.interceptor';
import { erroGlobalInterceptor } from './app/shared/http/erro-global.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([authTokenInterceptor, erroGlobalInterceptor])
    )
  ]
});
```

> A **ordem** no array define a sequência de execução na **ida** da requisição; na volta (resposta), a ordem é inversa.

---

## 2) Interceptador de **autenticação** (anexar token)

`auth-token.interceptor.ts`
```ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.obterToken(); // string | null

  // Evita anexar em rotas públicas, se necessário
  const ehPublica = req.url.includes('/public/') || req.headers.has('X-Skip-Auth');
  if (!token || ehPublica) {
    return next(req);
  }

  const reqComToken = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
  return next(reqComToken);
};
```

- Use um cabeçalho como `X-Skip-Auth` para **pular** o interceptor em chamadas específicas.
- Centralize a lógica de onde buscar o token (`AuthService`), sem espalhar por componentes.

---

## 3) Interceptador de **erros globais**

`erro-global.interceptor.ts`
```ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

function mensagemAmigavel(e: HttpErrorResponse): string {
  if (e.status === 0) return 'Falha de conexão. Tente novamente.';
  if (e.status === 401) return 'Sessão expirada. Faça login novamente.';
  if (e.status === 403) return 'Sem permissão para realizar esta ação.';
  if (e.status === 404) return 'Recurso não encontrado.';
  if (e.status >= 500) return 'Erro no servidor. Tente mais tarde.';
  return e.error?.message || e.message || 'Erro inesperado';
}

export const erroGlobalInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // Redirecionar em 401 (opcional)
      if (err.status === 401) {
        router.navigate(['/login']);
      }
      // Log e normalização
      const msg = mensagemAmigavel(err);
      console.error('[HTTP ERROR]', req.method, req.url, err.status, msg);

      // Repropaga para camadas que precisem tratar localmente
      return throwError(() => err);
    })
  );
};
```

> Use interceptadores para **comportamentos transversais**; ainda é válido tratar erros **localmente** quando a UI precisa de feedback específico.

---

## 4) Interceptador de **logging/tempo** (métricas)

`logger.interceptor.ts`
```ts
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize, tap } from 'rxjs';

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
  const inicio = performance.now();
  return next(req).pipe(
    tap(() => {/* ponto para side-effects se necessário */}),
    finalize(() => {
      const duracao = Math.round(performance.now() - inicio);
      console.info(`[HTTP] ${req.method} ${req.urlWithParams} - ${duracao}ms`);
    })
  );
};
```

- `finalize()` executa no **sucesso ou erro** — ideal para métricas e loaders globais.

---

## 5) Interceptador de **cache** (GET idempotente) — exemplo simples

`cache.interceptor.ts`
```ts
import { HttpEvent, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

const cacheMap = new Map<string, HttpResponse<unknown>>();

export const cacheInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next): Observable<HttpEvent<any>> => {
  if (req.method !== 'GET' || req.headers.has('X-Bypass-Cache')) {
    return next(req);
  }

  const chave = req.urlWithParams;
  const emCache = cacheMap.get(chave);
  if (emCache) {
    return of(emCache.clone());
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        cacheMap.set(chave, event.clone());
      }
    })
  );
};
```

- **Invalide** o cache quando um `POST/PUT/DELETE` relevante ocorrer (ex.: limpando `cacheMap` condicionalmente).
- Permita **bypassar** via `X-Bypass-Cache` quando necessário.

---

## 6) Interceptador de **progresso de upload/download** (eventos)

`progresso.interceptor.ts`
```ts
import { HttpEvent, HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const progressoInterceptor: HttpInterceptorFn = (req, next) => {
  // Ative apenas quando explicitamente solicitado
  if (!req.headers.has('X-Track-Progress')) {
    return next(req);
  }

  return next(req).pipe(
    tap((event: HttpEvent<any>) => {
      if (event.type === HttpEventType.UploadProgress && event.total) {
        const pct = Math.round((event.loaded / event.total) * 100);
        console.log(`[UPLOAD] ${pct}%`);
      }
      if (event.type === HttpEventType.DownloadProgress && event.total) {
        const pct = Math.round((event.loaded / event.total) * 100);
        console.log(`[DOWNLOAD] ${pct}%`);
      }
    })
  );
};
```

Uso em uma chamada específica:
```ts
this.http.post('/api/upload', formData, {
  headers: { 'X-Track-Progress': '1' },
  reportProgress: true,
  observe: 'events'
});
```

---

## 7) Boas práticas
1. **Mantenha interceptadores pequenos e focados** (auth, erro, log, cache).  
2. **Ordem importa**: autenticação → log → erro (por exemplo).  
3. Evite lógicas pesadas/bloqueantes; não transforme `GET` em chamadas que mudam estado.  
4. Exponha **flags via headers** (ex.: `X-Skip-Auth`, `X-Bypass-Cache`) para controle granular.  
5. **Repropague erros** com `throwError` quando a camada superior precisar reagir.  
6. Teste interceptadores isoladamente (mocks do `HttpClientTestingModule`).  

---

✅ **Resumo**
Interceptadores centralizam **token**, **erros**, **logs**, **cache** e **progresso**.  
Registre-os com `withInterceptors([...])`, cuide da **ordem** e mantenha-os **coesos** para uma arquitetura limpa.

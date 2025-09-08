## 📌 Tratamento de Erros HTTP no Angular

Erros HTTP acontecem por **falhas de rede**, **erros do servidor**, **timeouts**, **requisições canceladas**, entre outros.  
No Angular, tratamos erros com **RxJS** (`catchError`, `retry`, `finalize`) e podemos **centralizar** lógica em **interceptadores**.

---

## 1) Tipos de erro com `HttpErrorResponse`

Toda falha do `HttpClient` chega como `HttpErrorResponse`:

```ts
import { HttpErrorResponse } from '@angular/common/http';

function extrairMensagem(erro: unknown): string {
  const e = erro as HttpErrorResponse;
  // Backend costuma mandar payload em e.error
  const detalhe = typeof e.error === 'string'
    ? e.error
    : e.error?.message ?? e.message;

  switch (e.status) {
    case 0:   return 'Falha de conexão. Verifique sua rede.';            // erro de rede/CORS
    case 400: return detalhe || 'Requisição inválida.';
    case 401: return 'Não autenticado. Faça login novamente.';
    case 403: return 'Sem permissão para executar esta ação.';
    case 404: return 'Recurso não encontrado.';
    case 422: return 'Dados inválidos. Verifique os campos.';
    case 500: return 'Erro interno no servidor.';
    default:  return detalhe || `Erro inesperado (${e.status}).`;
  }
}
```

---

## 2) Tratamento **local** por requisição

Use `catchError` para converter o erro em um **Observable válido** (ex.: fallback vazio) e **`finalize`** para encerrar _loading_ com sucesso ou erro.

```ts
import { catchError, finalize, of, tap } from 'rxjs';

carregarProdutos() {
  this.loading.set(true);

  return this.http.get<Produto[]>('/api/produtos').pipe(
    tap(() => this.erro.set(null)),
    catchError((err) => {
      this.erro.set(extrairMensagem(err));
      // Fallback seguro
      return of<Produto[]>([]);
    }),
    finalize(() => this.loading.set(false))
  );
}
```

> **Dica**: quando precisar **propagar** o erro para **camadas acima**, use `throwError(() => err)` dentro do `catchError` em vez de engolir o erro.

---

## 3) **Retry** com critério (evite repetir erro do servidor)

`retry(n)` repete em qualquer erro — perigoso. Prefira `retryWhen` com critérios (somente falhas transitórias).

```ts
import { retryWhen, scan, delay, of } from 'rxjs';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

const backoffMs = [500, 1000, 2000]; // exponencial simples

this.http.get('/api/status').pipe(
  retryWhen(errors =>
    errors.pipe(
      scan((tentativa, erro: HttpErrorResponse) => {
        const podeTentar =
          erro.status === 0 || // falha de rede
          erro.status === HttpStatusCode.TooManyRequests ||
          erro.status === HttpStatusCode.ServiceUnavailable ||
          erro.status === HttpStatusCode.GatewayTimeout;

        if (!podeTentar || tentativa >= backoffMs.length) {
          throw erro; // propaga
        }
        return tentativa + 1;
      }, 0),
      delay((n) => backoffMs[n - 1])
    )
  )
);
```

---

## 4) Padronize o **contrato de erro** do backend

Defina um formato consistente para o backend retornar erros (ex.: `status`, `code`, `message`, `details`).

```ts
export type ApiError = {
  code: string;            // ex.: "VALIDATION_ERROR"
  message: string;         // msg amigável
  details?: Record<string, string[]>; // por campo
};

// Extração segura
function getApiError(e: HttpErrorResponse): ApiError | null {
  return (e.error && typeof e.error === 'object')
    ? e.error as ApiError
    : null;
}
```

Uso:
```ts
catchError((err: HttpErrorResponse) => {
  const api = getApiError(err);
  if (api?.details) {
    this.formErrors.set(api.details); // exibir por campo
  }
  this.toast.error(api?.message ?? extrairMensagem(err));
  return of([]);
})
```

---

## 5) **Interceptador** para tratamento global

Centralize anexação de token, _logging_ e normalização de mensagens.  
No Angular moderno, registre com `provideHttpClient(withInterceptors([...]))`.

```ts
// auth-error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { extrairMensagem } from './erros-util';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        // opcional: limpar sessão e redirecionar
        router.navigate(['/login']);
      }
      // você pode mapear/normalizar a mensagem aqui
      const mensagem = extrairMensagem(err);
      console.error('[HTTP ERROR]', req.method, req.url, err.status, mensagem);
      return throwError(() => err); // mantém comportamento para camadas acima
    })
  );
};
```

Registro no `main.ts`:
```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authErrorInterceptor } from './shared/http/auth-error.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([authErrorInterceptor])
    )
  ]
});
```

---

## 6) Erros em **download/upload** e progresso

Para uploads grandes, combine `reportProgress` e `observe: 'events'` e trate `HttpEventType`.

```ts
import { HttpEvent, HttpEventType } from '@angular/common/http';

enviarArquivo(arquivo: File) {
  const form = new FormData();
  form.append('file', arquivo);

  return this.http.post('/api/upload', form, {
    reportProgress: true,
    observe: 'events'
  }).pipe(
    tap((ev: HttpEvent<any>) => {
      if (ev.type === HttpEventType.UploadProgress && ev.total) {
        const pct = Math.round((ev.loaded / ev.total) * 100);
        this.progresso.set(pct);
      }
    }),
    catchError(err => {
      this.toast.error(extrairMensagem(err));
      return throwError(() => err);
    })
  );
}
```

---

## 7) UX e acessibilidade ao tratar erros

- Mostre mensagens **claras e acionáveis** (o que aconteceu e o que o usuário pode fazer).
- Para formulários, foque o primeiro campo com erro e descreva a mensagem (`aria-live="assertive"`).
- Registre detalhes técnicos em **log** (não mostre stack/IDs sensíveis ao usuário).

```html
<div class="alerta-erro" role="alert" aria-live="assertive" *ngIf="erro()">
  {{ erro() }}
</div>
```

---

## 8) Boas práticas

1. **Não abuse de `retry`** para erros 4xx (cliente) — corrija a entrada.  
2. Em **401/403**, limpe sessão/credenciais e redirecione conforme política da app.  
3. Padronize **contratos de erro** no backend e trate-os em um único lugar.  
4. Use **interceptadores** para cross‑cutting (token, logs, normalização).  
5. Use `finalize()` para **encerrar loaders** mesmo em caso de erro.  
6. Evite `subscribe()` aninhado; trate erros **no fluxo** com operadores.  

---

✅ **Resumo**
- Trate erros com `catchError` e feche recursos com `finalize`.  
- Repetição com critério (`retryWhen`) apenas para falhas transitórias.  
- Centralize comportamentos comuns em **interceptadores** e padronize mensagens/contratos.

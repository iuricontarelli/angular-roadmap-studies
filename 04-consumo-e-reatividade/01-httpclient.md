## 📌 Uso do `HttpClient` no Angular (`@angular/common/http`)

O `HttpClient` é o serviço oficial do Angular para fazer **requisições HTTP** (GET, POST, PUT, DELETE, etc.).  
No Angular moderno, configure-o com `provideHttpClient()` e injete-o com `inject(HttpClient)` ou via construtor.

---

## 1) Configuração (standalone)
No `main.ts` habilite o `HttpClient` para toda a aplicação:
```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()]
});
```

> Observação: Interceptadores entram depois com `withInterceptors()` (ver tópico próprio).

---

## 2) Injetando o `HttpClient` e criando um serviço de API
Crie serviços finos, com **tipagem forte** e nomes semânticos.

```ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type Produto = { id: number; nome: string; preco: number };

@Injectable({ providedIn: 'root' })
export class ProdutosApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/produtos';

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.baseUrl);
  }

  buscarPorId(idProduto: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/${idProduto}`);
  }

  criar(novo: Omit<Produto, 'id'>): Observable<Produto> {
    return this.http.post<Produto>(this.baseUrl, novo);
  }

  atualizar(idProduto: number, dados: Partial<Produto>): Observable<Produto> {
    return this.http.put<Produto>(`${this.baseUrl}/${idProduto}`, dados);
  }

  remover(idProduto: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idProduto}`);
  }
}
```

---

## 3) Usando em componentes (AsyncPipe)
Prefira **`AsyncPipe`** para assinar observables no template, evitando `subscribe()` manual.

```ts
import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { ProdutosApiService, Produto } from './produtos-api.service';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-lista-produtos',
  imports: [AsyncPipe, NgFor],
  template: `
    <ul>
      <li *ngFor="let p of produtos$ | async">
        {{ p.nome }} - {{ p.preco | currency:'BRL' }}
      </li>
    </ul>
  `
})
export class ListaProdutosComponent {
  private api = inject(ProdutosApiService);
  produtos$: Observable<Produto[]> = this.api.listar();
}
```

---

## 4) Enviando **parâmetros de consulta** e **headers**
Use `HttpParams` e `HttpHeaders` (ou objetos literais simples).

```ts
import { HttpParams, HttpHeaders } from '@angular/common/http';

listarPaginado(pagina: number, tamanho: number, busca?: string) {
  const params = new HttpParams()
    .set('page', pagina)
    .set('size', tamanho)
    .set('q', busca ?? '');

  const headers = new HttpHeaders().set('X-Cliente', 'WM');

  return this.http.get<Produto[]>(this.baseUrl, { params, headers });
}
```

Também é válido:
```ts
this.http.get<Produto[]>(this.baseUrl, {
  params: { page: pagina, size: tamanho, q: busca ?? '' },
  headers: { 'X-Cliente': 'WM' }
});
```

---

## 5) Acessando **resposta completa** (status/headers)
Use `observe: 'response'` para obter `HttpResponse<T>`.

```ts
import { HttpResponse } from '@angular/common/http';

buscarComMeta(idProduto: number) {
  return this.http.get<Produto>(`${this.baseUrl}/${idProduto}`, {
    observe: 'response'
  });
}

// Uso:
this.buscarComMeta(10).subscribe((resp: HttpResponse<Produto>) => {
  console.log('status:', resp.status);
  console.log('cabecalhos:', resp.headers.get('ETag'));
  console.log('body:', resp.body);
});
```

---

## 6) Baixando **arquivos** (Blob) e enviando **FormData**
```ts
baixarNotaFiscal(id: number) {
  return this.http.get(`${this.baseUrl}/${id}/nota-fiscal`, {
    responseType: 'blob' // retorna Blob para download
  });
}

enviarDocumento(arquivo: File, codigoLayout: string) {
  const form = new FormData();
  form.append('arquivo', arquivo);
  form.append('layout', codigoLayout);
  return this.http.post(`${this.baseUrl}/upload`, form);
}
```

---

## 7) Integração com **Signals** (opcional, Angular 17+)
Converta o fluxo para signal com `toSignal` (sem precisar dar unsubscribe).

```ts
import { toSignal } from '@angular/core/rxjs-interop';
import { signal, computed, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProdutosState {
  private api = inject(ProdutosApiService);
  produtos = toSignal(this.api.listar(), { initialValue: [] as Produto[] });
  total = computed(() => this.produtos().length);
}
```

Uso no componente:
```ts
@Component({
  standalone: true,
  selector: 'app-dashboard',
  template: `Total de produtos: {{ estado.total() }}`
})
export class DashboardComponent {
  estado = inject(ProdutosState);
}
```

---

## 8) Dicas de **boas práticas**
1. **Serviços finos e tipados**: cada endpoint em um método, com tipos explícitos.
2. Evite `any`; modele **DTOs** e **tipos** para entradas/saídas.
3. Prefira `AsyncPipe` ou `toSignal()` em vez de `subscribe()` manual.
4. Centralize a `baseUrl` (ex.: `environment.ts` ou constante no serviço).
5. Use **interceptadores** para anexar tokens, tratar erros e logar (ver tópico dedicado).
6. Para paginação/sort/filtro, crie funções utilitárias que montem `HttpParams`.
7. Em uploads grandes, avalie `reportProgress: true` e `observe: 'events'` para progresso.

---

✅ **Resumo**
- Configure com `provideHttpClient()` e injete `HttpClient` nos serviços.
- Use **tipagem forte**, `AsyncPipe` e **Signals** para reatividade limpa.
- Trate params/headers corretamente e acesse metadados com `observe: 'response'` quando necessário.

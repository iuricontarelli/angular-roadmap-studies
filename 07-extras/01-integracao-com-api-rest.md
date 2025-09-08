## 📌 Integração com API REST real

Este guia mostra como integrar um app Angular com uma **API REST real** usando `HttpClient`, boas práticas de tipagem, paginação, cache e testes.

---

## 1) Organização básica

- **Serviço de API** por recurso (ex.: `ProdutosApiService`).
- **Tipos/DTOs** definidos em `src/app/shared/models/`.
- **Mappers** para converter **DTO → Domínio** quando necessário.
- **Interceptadores** para token/log/erros.

```
src/app/
 ├── shared/
 │   ├── models/
 │   │   ├── produto.model.ts        # tipos de domínio
 │   │   └── produto.dto.ts          # tipos do payload da API
 │   ├── http/
 │   │   ├── auth-token.interceptor.ts
 │   │   └── erro-global.interceptor.ts
 │   └── utils/
 │       └── mappers/
 │           └── produto.mapper.ts
 └── features/produtos/
     └── data/produtos-api.service.ts
```

---

## 2) Serviço de API (tipado e enxuto)
```ts
// produtos-api.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { ProdutoDTO, ListaPaginadaDTO } from '@shared/models/produto.dto';
import { Produto } from '@shared/models/produto.model';
import { toProduto } from '@shared/utils/mappers/produto.mapper';

@Injectable({ providedIn: 'root' })
export class ProdutosApiService {
  private http = inject(HttpClient);
  private baseUrl = '/api/produtos';

  listar(pagina = 0, tamanho = 10, busca?: string): Observable<Produto[]> {
    const params = new HttpParams()
      .set('page', pagina)
      .set('size', tamanho)
      .set('q', busca ?? '');

    return this.http.get<ListaPaginadaDTO<ProdutoDTO>>(`${this.baseUrl}`, { params })
      .pipe(map(dto => dto.items.map(toProduto)));
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<ProdutoDTO>(`${this.baseUrl}/${id}`).pipe(map(toProduto));
  }

  criar(payload: Omit<ProdutoDTO, 'id'>): Observable<Produto> {
    return this.http.post<ProdutoDTO>(this.baseUrl, payload).pipe(map(toProduto));
  }

  atualizar(id: number, payload: Partial<ProdutoDTO>): Observable<Produto> {
    return this.http.put<ProdutoDTO>(`${this.baseUrl}/${id}`, payload).pipe(map(toProduto));
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
```

---

## 3) Paginação, ordenação e filtro
- Use **`HttpParams`** para query params (`page`, `size`, `sort`, `q`).
- Guarde estado de página/filtro no componente/Store.

```ts
listar(pagina = 0, tamanho = 10, sort = 'nome,asc') {
  const params = new HttpParams().set('page', pagina).set('size', tamanho).set('sort', sort);
  return this.http.get<ListaPaginadaDTO<ProdutoDTO>>(this.baseUrl, { params });
}
```

---

## 4) Cache e compartilhamento
Para GET idempotente com múltiplos consumidores:
```ts
dados$ = this.http.get<Produto[]>(this.baseUrl).pipe(shareReplay(1));
```
- Invalide o cache após **criar/atualizar/remover**.

---

## 5) Tratamento de erros e loading
- `catchError` + `finalize` por chamada (ou global via interceptador).
- Mensagens amigáveis para o usuário, log técnico no console/observabilidade.

---

## 6) Testes locais com API fake
- **json-server**: mock rápido de REST.
- **MSW (Mock Service Worker)**: intercepta `fetch/XHR` no browser para fixtures.
- **Interceptores**: podem redirecionar para mocks com `X-Use-Mock` (estratégia).

---

## 7) OpenAPI/Swagger (opcional)
- Gere **clientes tipados** a partir do **OpenAPI** do backend (ex.: `openapi-typescript-codegen`).
- Reduz erros de contrato e acelera a implementação.

---

✅ **Resumo**: Serviços finos, DTOs claros, mappers, erro/loading previsíveis, cache controlado e testes locais sólidos formam a base de uma integração REST profissional.

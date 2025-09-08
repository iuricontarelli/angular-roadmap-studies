## 📌 Organização de Models e DTOs

Separe **tipos de domínio** (usados na UI) de **DTOs** (contrato da API). Isso reduz acoplamento e facilita evolução.

---

## 1) Estrutura de pastas
```
src/app/shared/models/
 ├── produto.model.ts     # tipos de domínio
 ├── produto.dto.ts       # tipos do payload da API
 └── index.ts             # barrel exports
src/app/shared/utils/mappers/
 └── produto.mapper.ts    # conversões DTO <-> domínio
```

---

## 2) Tipos
```ts
// produto.dto.ts
export type ProdutoDTO = { id: number; nm: string; preco_cents: number };
export type ListaPaginadaDTO<T> = { total: number; items: T[] };

// produto.model.ts
export type Produto = { id: number; nome: string; preco: number };
```

---

## 3) Mapper
```ts
// produto.mapper.ts
export const toProduto = (dto: ProdutoDTO): Produto => ({
  id: dto.id,
  nome: dto.nm,
  preco: dto.preco_cents / 100
});

export const toProdutoDTO = (p: Produto): ProdutoDTO => ({
  id: p.id,
  nm: p.nome,
  preco_cents: Math.round(p.preco * 100)
});
```

---

## 4) Validação (opcional)
Para validar respostas, use libs como **zod**.
```ts
import { z } from 'zod';

export const ProdutoDTOSchema = z.object({
  id: z.number(),
  nm: z.string(),
  preco_cents: z.number().nonnegative()
});

// uso: ProdutoDTOSchema.parse(resposta)
```

---

## 5) Boas práticas
- **Nome semântico** em PT-BR para modelos da UI (`Produto`, `Pedido`).
- **Mantenha DTOs próximos** do contrato real da API (não traduza chaves arbitrariamente).
- Centralize **mapeamentos** em arquivos próprios.
- **Evite `any`**; use tipos e utilitários (`Pick`, `Partial`, `Readonly`).

---

✅ **Resumo**: separar **DTO** e **Model** reduz acoplamento e deixa claro o que é **contrato externo** versus **modelo interno** da aplicação.

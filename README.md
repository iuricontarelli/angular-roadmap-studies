# ✅ Roadmap Angular - Checklist de Estudo

Este checklist está organizado por etapas progressivas, desde os fundamentos até tópicos mais avançados.
Marque `[x]` conforme for completando cada item.  
Itens com 🔸 são opcionais/intermediários.  
Itens com 🔹 são avançados/futuros.

## ✅ Etapa 1: Fundamentos de TypeScript (Pré-requisito)

- [x] Tipos primitivos (string, number, boolean, etc.)
- [x] Funções (declarações, arrow functions, parâmetros opcionais/padrão)
- [x] Arrays, Tuplas, Enums e tipos especiais (`any`, `unknown`, `void`, `never`)
- [x] Union Types e Type Aliases (`string | number`, `type Id = string`)
- [x] Type Assertions (`as`, `<>`)
- [x] Interfaces
- [x] Classes e herança
- [x] Generics
- [x] Modularização (import/export entre arquivos)
- [x] 🔹 Tipos avançados (`readonly`, `keyof`, `in`, `typeof`, `infer`, `satisfies`)

## ✅ Etapa 2: Conceitos essenciais do Angular

- [x] Componentes standalone
- [x] Data Binding: interpolação, property binding, event binding, two-way
- [x] Diretivas estruturais (`*ngIf`, `*ngFor`)
- [x] Diretivas de atributo (`[ngClass]`, `[ngStyle]`)
- [x] Pipes (nativos e customizados)
- [x] Manipulação de eventos no template
- [x] Formulários: Template-driven
- [x] Formulários: Reactive Forms

## ✅ Etapa 3: Estrutura e arquitetura de aplicação

- [x] Serviços e Injeção de Dependência
- [x] Roteamento básico e avançado
- [x] Lazy loading de rotas
- [x] Rotas protegidas com Guards
- [x] Comunicação entre componentes (Input/Output)
- [x] Serviços compartilhados
- [x] Diretivas customizadas
- [x] Organização por feature
- [x] Shared Module vs Core Module

## ✅ Etapa 4: Consumo de dados e reatividade

- [x] Uso do `HttpClient` (`@angular/common/http`)
- [x] Observables e RxJS
- [x] Principais operadores: `map`, `tap`, `switchMap`, `catchError`
- [x] Uso de `Subject` e `BehaviorSubject`
- [x] Tratamento de erros HTTP
- [x] Interceptadores HTTP
- [x] 🔸 NGRX Signals

## 🔄 Etapa 5: Experiência do usuário

- [x] Acessibilidade (A11Y) básica
- [x] Design system / Biblioteca de componentes (ex: PrimeNG)
- [x] 🔸 Internacionalização (`@angular/localize`)
- [x] 🔸 Otimizações de performance (`trackBy`, `ChangeDetectionStrategy`, etc.)

## 🔜 Etapa 6: Recursos avançados

- [x] 🔹 Server-Side Rendering (Angular Universal)
- [x] 🔹 Static Site Generation
- [x] 🔹 State Management (NGRX, NGXS, SignalsStore)
- [x] 🔹 Testes unitários com Jasmine/Karma
- [x] 🔹 Testes e2e com Cypress/Playwright
- [ ] 🔹 Design Patterns no Angular

## 🧩 Extras importantes para o mundo real

- [ ] Integração com API REST real
- [ ] Autenticação (Token, Keycloak, etc.)
- [ ] Uso de variáveis de ambiente (`environment.ts`)
- [ ] Organização de models e DTOs
- [ ] Versionamento com Git + Conventional Commits
- [ ] Deploy do app Angular (Vercel, Netlify, S3, etc.)

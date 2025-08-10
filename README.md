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
- [ ] Formulários: Template-driven
- [ ] Formulários: Reactive Forms

## ✅ Etapa 3: Estrutura e arquitetura de aplicação

- [ ] Serviços e Injeção de Dependência
- [ ] Roteamento básico e avançado
- [ ] Lazy loading de rotas
- [ ] Rotas protegidas com Guards
- [ ] Comunicação entre componentes (Input/Output)
- [ ] Serviços compartilhados
- [ ] Diretivas customizadas
- [ ] Organização por feature
- [ ] Shared Module vs Core Module

## ✅ Etapa 4: Consumo de dados e reatividade

- [ ] Uso do `HttpClient` (`@angular/common/http`)
- [ ] Observables e RxJS
- [ ] Principais operadores: `map`, `tap`, `switchMap`, `catchError`
- [ ] Uso de `Subject` e `BehaviorSubject`
- [ ] Tratamento de erros HTTP
- [ ] Interceptadores HTTP
- [ ] 🔸 NGRX Signals (opcional, mais avançado)

## 🔄 Etapa 5: Experiência do usuário

- [ ] Acessibilidade (A11Y) básica
- [ ] Design system / Biblioteca de componentes (ex: PrimeNG)
- [ ] 🔸 Internacionalização (`@angular/localize`)
- [ ] 🔸 Otimizações de performance (`trackBy`, `ChangeDetectionStrategy`, etc.)

## 🔜 Etapa 6: Recursos avançados (posterior)

- [ ] 🔹 Server-Side Rendering (Angular Universal)
- [ ] 🔹 Static Site Generation
- [ ] 🔹 State Management (NGRX, NGXS, SignalsStore)
- [ ] 🔹 Testes unitários com Jasmine/Karma
- [ ] 🔹 Testes e2e com Cypress/Playwright
- [ ] 🔹 Design Patterns no Angular

## 🧩 Extras importantes para o mundo real

- [ ] Integração com API REST real
- [ ] Autenticação (Token, Keycloak, etc.)
- [ ] Uso de variáveis de ambiente (`environment.ts`)
- [ ] Organização de models e DTOs
- [ ] Versionamento com Git + Conventional Commits
- [ ] Deploy do app Angular (Vercel, Netlify, S3, etc.)

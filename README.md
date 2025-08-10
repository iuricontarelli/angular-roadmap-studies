# ✅ Roadmap Angular - Checklist de Estudo

Este checklist está organizado por etapas progressivas, desde os fundamentos até tópicos mais avançados.
Marque `[x]` conforme for completando cada item.  
Itens com 🔸 são opcionais/intermediários.  
Itens com 🔹 são avançados/futuros.

## ✅ Etapa 1: Fundamentos de TypeScript (Pré-requisito)

- [x] Tipos primitivos (string, number, boolean, etc.)
- [x] Funções (declarações, arrow functions, parâmetros opcionais/padrão)
- [x] Arrays, Tuplas, Enums e tipos especiais (`any`, `unknown`, `void`, `never`)
- [ ] Union Types e Type Aliases (`string | number`, `type Id = string`)
- [ ] Type Assertions (`as`, `<>`)
- [ ] Interfaces
- [ ] Classes e herança
- [ ] Generics
- [ ] Modularização (import/export entre arquivos)
- [ ] 🔹 Tipos avançados (`readonly`, `keyof`, `in`, `typeof`, `infer`, `satisfies`)

## ✅ Etapa 2: Fundamentos do Angular com CLI

- [ ] Instalar Angular CLI
- [ ] Criar projeto Angular com CLI
- [ ] Gerar componentes com CLI
- [ ] Gerar serviços com CLI
- [ ] Executar app com `ng serve`
- [ ] Buildar com `ng build`
- [ ] Organização inicial da estrutura de pastas

## ✅ Etapa 3: Conceitos essenciais do Angular

- [ ] Componentes standalone
- [ ] Data Binding: interpolação, property binding, event binding, two-way
- [ ] Diretivas estruturais (`*ngIf`, `*ngFor`)
- [ ] Diretivas de atributo (`[ngClass]`, `[ngStyle]`)
- [ ] Pipes (nativos e customizados)
- [ ] Manipulação de eventos no template
- [ ] Formulários: Template-driven
- [ ] Formulários: Reactive Forms

## ✅ Etapa 4: Estrutura e arquitetura de aplicação

- [ ] Serviços e Injeção de Dependência
- [ ] Roteamento básico e avançado
- [ ] Lazy loading de rotas
- [ ] Rotas protegidas com Guards
- [ ] Comunicação entre componentes (Input/Output)
- [ ] Serviços compartilhados
- [ ] Diretivas customizadas
- [ ] Organização por feature
- [ ] Shared Module vs Core Module

## ✅ Etapa 5: Consumo de dados e reatividade

- [ ] Uso do `HttpClient` (`@angular/common/http`)
- [ ] Observables e RxJS
- [ ] Principais operadores: `map`, `tap`, `switchMap`, `catchError`
- [ ] Uso de `Subject` e `BehaviorSubject`
- [ ] Tratamento de erros HTTP
- [ ] Interceptadores HTTP
- [ ] 🔸 NGRX Signals (opcional, mais avançado)

## 🔄 Etapa 6: Experiência do usuário

- [ ] Acessibilidade (A11Y) básica
- [ ] Design system / Biblioteca de componentes (ex: PrimeNG)
- [ ] 🔸 Internacionalização (`@angular/localize`)
- [ ] 🔸 Otimizações de performance (`trackBy`, `ChangeDetectionStrategy`, etc.)

## 🔜 Etapa 7: Recursos avançados (posterior)

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

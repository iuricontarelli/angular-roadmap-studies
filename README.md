# 📚 Roadmap Angular - Estudo Estruturado

Este roadmap organiza o estudo de **Angular** em etapas progressivas, desde os fundamentos de TypeScript até recursos avançados e práticas do mundo real.  
Cada tópico possui anotações detalhadas em arquivos separados para consulta posterior.

---

## ✅ Etapa 1: Fundamentos de TypeScript (Pré-requisito)
- Tipos primitivos (string, number, boolean, etc.)
- Funções (declarações, arrow functions, parâmetros opcionais/padrão)
- Arrays, Tuplas, Enums e tipos especiais (`any`, `unknown`, `void`, `never`)
- Union Types e Type Aliases (`string | number`, `type Id = string`)
- Type Assertions (`as`, `<>`)
- Interfaces
- Classes e herança
- Generics
- Modularização (import/export entre arquivos)
- 🔹 Tipos avançados (`readonly`, `keyof`, `in`, `typeof`, `infer`, `satisfies`)

---

## ✅ Etapa 2: Conceitos essenciais do Angular
- Componentes standalone
- Data Binding: interpolação, property binding, event binding, two-way
- Diretivas estruturais (`*ngIf`, `*ngFor`)
- Diretivas de atributo (`[ngClass]`, `[ngStyle]`)
- Pipes (nativos e customizados)
- Manipulação de eventos no template
- Formulários: Template-driven
- Formulários: Reactive Forms

---

## ✅ Etapa 3: Estrutura e arquitetura de aplicação
- Serviços e Injeção de Dependência
- Roteamento básico e avançado
- Lazy loading de rotas
- Rotas protegidas com Guards
- Comunicação entre componentes (Input/Output)
- Serviços compartilhados
- Diretivas customizadas
- Organização por feature
- Shared Module vs Core Module

---

## ✅ Etapa 4: Consumo de dados e reatividade
- Uso do `HttpClient` (`@angular/common/http`)
- Observables e RxJS
- Principais operadores: `map`, `tap`, `switchMap`, `catchError`
- Uso de `Subject` e `BehaviorSubject`
- Tratamento de erros HTTP
- Interceptadores HTTP
- 🔸 NGRX Signals

---

## ✅ Etapa 5: Experiência do usuário
- Acessibilidade (A11Y) básica
- Design system / Biblioteca de componentes (ex: PrimeNG)
- 🔸 Internacionalização (`@angular/localize`)
- 🔸 Otimizações de performance (`trackBy`, `ChangeDetectionStrategy`, etc.)

---

## ✅ Etapa 6: Recursos avançados
- 🔹 Server-Side Rendering (Angular Universal)
- 🔹 Static Site Generation
- 🔹 State Management (NGRX, NGXS, SignalsStore)
- 🔹 Testes unitários com Jasmine/Karma
- 🔹 Testes e2e com Cypress/Playwright
- 🔹 Design Patterns no Angular

---

## 🧩 Extras importantes para o mundo real
- Integração com API REST real
- Autenticação (Token, Keycloak, etc.)
- Uso de variáveis de ambiente (`environment.ts`)
- Organização de models e DTOs
- Versionamento com Git + Conventional Commits
- Deploy do app Angular (Vercel, Netlify, S3, etc.)

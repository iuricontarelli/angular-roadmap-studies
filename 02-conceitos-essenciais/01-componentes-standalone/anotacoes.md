## 📌 Componentes Standalone no Angular

### O que são?
Componentes **standalone** foram introduzidos no Angular 14 para permitir criar componentes sem precisar declará-los em um módulo (`NgModule`).  
Isso torna o código mais simples, modular e fácil de manter, já que o próprio componente define suas dependências.

---

### Benefícios
- Menos arquivos e menos boilerplate (não precisa criar módulos para tudo).
- Facilita o **lazy loading** e divisão da aplicação por funcionalidades.
- Mais próximo de bibliotecas modernas que usam componentes independentes.
- Melhor clareza sobre as dependências do componente.

---

### Criando um componente standalone
A partir do Angular CLI:
```ts
ng generate component nome-componente --standalone
```

Isso cria um componente já configurado com a propriedade:
```ts
@Component({
  standalone: true,
  selector: 'app-exemplo',
  templateUrl: './exemplo.component.html',
  styleUrls: ['./exemplo.component.css'],
  imports: [] // aqui você adiciona módulos ou outros componentes standalone
})
export class ExemploComponent { }
```

---

### Importando módulos ou outros componentes
Como não existe mais um módulo para declarar, as dependências devem ser adicionadas no array `imports` do próprio componente:
```ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-lista',
  template: `
    <h2>Lista de itens</h2>
    <ul>
      <li *ngFor="let item of itens">{{ item }}</li>
    </ul>
  `,
  imports: [CommonModule] // Importa diretivas como *ngFor e *ngIf
})
export class ListaComponent {
  itens = ['Item 1', 'Item 2', 'Item 3'];
}
```

---

### Utilizando um componente standalone em outro
Você pode importar diretamente no `imports` do componente pai:
```ts
import { Component } from '@angular/core';
import { ListaComponent } from './lista.component';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `<app-lista></app-lista>`,
  imports: [ListaComponent]
})
export class HomeComponent { }
```

---

### Usando no roteamento
No `app.routes.ts`:
```ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }
];
```

No `main.ts`:
```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

bootstrapApplication(HomeComponent, {
  providers: [provideRouter(routes)]
});
```

---

### Boas práticas
1. **Usar standalone para novos componentes** — evita criar módulos desnecessários.
2. **Agrupar imports no próprio componente** — facilita leitura e manutenção.
3. **Preferir standalone também para diretivas e pipes** — maior reaproveitamento.
4. **Em projetos grandes**, ainda é possível usar módulos para contextos específicos (ex.: SharedModule), mas é opcional.

---

✅ **Resumo:**  
Componentes standalone simplificam a estrutura do Angular, permitindo que cada componente seja independente e declare suas próprias dependências. Essa abordagem reduz acoplamento e facilita o reuso.

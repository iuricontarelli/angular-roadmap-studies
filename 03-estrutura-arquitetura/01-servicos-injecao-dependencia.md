## 📌 Serviços e Injeção de Dependência no Angular

O Angular utiliza o padrão de **Injeção de Dependência (DI)** para promover a reutilização de código, testabilidade e separação de responsabilidades.

---

### 🔹 O que é um Serviço?
Um **serviço** é uma classe que encapsula lógica de negócio, acesso a dados ou funcionalidades compartilhadas entre componentes.

Exemplos de uso:
- Acesso a APIs (HTTP)
- Gerenciamento de estado
- Lógica de autenticação
- Compartilhamento de dados entre componentes

---

### 🔹 Criando um Serviço
Use o Angular CLI:
```bash
ng generate service nome-do-servico
```
Ou manualmente:
```ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExemploService {
  getMensagem() {
    return 'Olá do serviço!';
  }
}
```
- O decorator `@Injectable({ providedIn: 'root' })` faz com que o serviço seja singleton e disponível em toda a aplicação.

---

### 🔹 Injetando um Serviço em um Componente

**Forma tradicional (construtor):**
```ts
import { Component } from '@angular/core';
import { ExemploService } from './exemplo.service';

@Component({
  selector: 'app-exemplo',
  template: `{{ mensagem }}`
})
export class ExemploComponent {
  mensagem: string;
  constructor(private exemploService: ExemploService) {
    this.mensagem = this.exemploService.getMensagem();
  }
}
```
- Basta declarar o serviço como `private` (ou `public`) no construtor.

**Nova forma (usando `inject()`):**
```ts
import { Component, inject } from '@angular/core';
import { ExemploService } from './exemplo.service';

@Component({
  selector: 'app-exemplo',
  template: `{{ mensagem }}`
})
export class ExemploComponent {
  private exemploService = inject(ExemploService);
  mensagem = this.exemploService.getMensagem();
}
```
- O `inject()` permite acessar o serviço fora do construtor, útil para propriedades, métodos estáticos e funções auxiliares.

---

### 🔹 Escopos de Injeção
- `providedIn: 'root'`: singleton global
- `providedIn: 'any'`: singleton por módulo lazy-loaded
- Providers em `@Component`: instância única por componente

---

### 🔹 Boas práticas
1. Serviços devem ser stateless sempre que possível.
2. Use serviços para lógica compartilhada e acesso a dados.
3. Evite lógica de negócio complexa diretamente nos componentes.
4. Prefira `providedIn: 'root'` para a maioria dos casos.

---

✅ **Resumo:**
Serviços e DI são fundamentais para aplicações Angular escaláveis, promovendo código limpo, reutilizável e testável.

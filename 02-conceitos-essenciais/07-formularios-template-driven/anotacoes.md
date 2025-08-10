## 📌 Formulários no Angular - Template-driven

O **Template-driven Forms** é uma abordagem para trabalhar com formulários no Angular onde a maior parte da configuração é feita diretamente no **template HTML**, usando diretivas como `ngModel`, `ngForm` e `ngModelGroup`.

Essa abordagem é mais simples e indicada para formulários menores.

---

### 🔹 Configuração inicial
Para usar formulários template-driven, é necessário importar o `FormsModule` no componente standalone ou no módulo da aplicação.

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-form-template',
  imports: [FormsModule],
  templateUrl: './form-template.component.html'
})
export class FormTemplateComponent {
  usuario = {
    nome: '',
    email: ''
  };

  salvar() {
    console.log('Formulário enviado:', this.usuario);
  }
}
```

---

### 🔹 Template HTML
```html
<form #formulario="ngForm" (ngSubmit)="salvar()">
  <label>Nome:</label>
  <input type="text" name="nome" [(ngModel)]="usuario.nome" required />

  <label>Email:</label>
  <input type="email" name="email" [(ngModel)]="usuario.email" required />

  <button type="submit" [disabled]="formulario.invalid">Enviar</button>
</form>

<p>Nome digitado: {{ usuario.nome }}</p>
<p>Email digitado: {{ usuario.email }}</p>
```

---

### 🔹 Validações no template
- `required` → campo obrigatório.
- `minlength` / `maxlength` → tamanho mínimo/máximo.
- `email` → valida formato de e-mail.

Exemplo de mensagem de erro:
```html
<input type="email" name="email" [(ngModel)]="usuario.email" required email #emailCtrl="ngModel" />
<div *ngIf="emailCtrl.invalid && emailCtrl.touched">
  <small *ngIf="emailCtrl.errors?.['required']">Email é obrigatório.</small>
  <small *ngIf="emailCtrl.errors?.['email']">Formato de email inválido.</small>
</div>
```

---

### 🔹 Diretivas úteis

#### 1. `ngModel`
Faz a ligação bidirecional (two-way data binding) entre o campo de formulário e a propriedade do componente.
```html
<input type="text" name="nome" [(ngModel)]="usuario.nome" />
```
- `name` é obrigatório para que o Angular identifique o controle dentro do formulário.
- Pode ser usado com validações como `required`, `minlength`, etc.

#### 2. `ngForm`
Representa o formulário como um todo, fornecendo informações sobre seu estado e validade.
```html
<form #formulario="ngForm" (ngSubmit)="salvar()">
  <!-- campos -->
</form>
<p>Formulário válido? {{ formulario.valid }}</p>
```
- Pode acessar propriedades como `formulario.valid`, `formulario.invalid`, `formulario.touched`.

#### 3. `ngModelGroup`
Agrupa campos relacionados dentro de um formulário.
```html
<form #formulario="ngForm" (ngSubmit)="salvar()">
  <div ngModelGroup="endereco">
    <label>Rua:</label>
    <input name="rua" [(ngModel)]="usuario.endereco.rua" required />
    
    <label>Cidade:</label>
    <input name="cidade" [(ngModel)]="usuario.endereco.cidade" required />
  </div>
</form>
```
- Permite validar ou acessar o estado de um grupo de campos, como `formulario.controls['endereco'].valid`.

---

### 📌 Boas práticas
1. Usar Template-driven apenas para formulários simples.
2. Centralizar regras de negócio no componente, não no template.
3. Usar `ngModelGroup` para organizar formulários maiores.
4. Validar campos e grupos usando as propriedades expostas por `ngModel` e `ngForm`.

---

✅ **Resumo:**  
O Template-driven Forms é uma maneira rápida e simples de criar formulários no Angular, aproveitando diretivas (`ngModel`, `ngForm`, `ngModelGroup`) e validações no próprio HTML, sendo ideal para casos mais simples.

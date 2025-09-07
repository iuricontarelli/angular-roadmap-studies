## 📌 Formulários no Angular - Reactive Forms

O **Reactive Forms** é uma abordagem mais estruturada e programática para trabalhar com formulários no Angular.  
Toda a configuração e lógica do formulário é feita no **TypeScript**, oferecendo mais controle e escalabilidade.

---

### 🔹 Configuração inicial
Para usar Reactive Forms, é necessário importar o `ReactiveFormsModule`.

```ts
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-form-reactive',
  imports: [ReactiveFormsModule],
  templateUrl: './form-reactive.component.html'
})
export class FormReactiveComponent {
  formulario = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  salvar() {
    console.log('Formulário enviado:', this.formulario.value);
  }
}
```

---

### 🔹 Template HTML
```html
<form [formGroup]="formulario" (ngSubmit)="salvar()">
  <label>Nome:</label>
  <input type="text" formControlName="nome" />
  <div *ngIf="formulario.get('nome')?.invalid && formulario.get('nome')?.touched">
    <small *ngIf="formulario.get('nome')?.errors?.['required']">Nome é obrigatório.</small>
    <small *ngIf="formulario.get('nome')?.errors?.['minlength']">Mínimo de 3 caracteres.</small>
  </div>

  <label>Email:</label>
  <input type="email" formControlName="email" />
  <div *ngIf="formulario.get('email')?.invalid && formulario.get('email')?.touched">
    <small *ngIf="formulario.get('email')?.errors?.['required']">Email é obrigatório.</small>
    <small *ngIf="formulario.get('email')?.errors?.['email']">Formato inválido.</small>
  </div>

  <button type="submit" [disabled]="formulario.invalid">Enviar</button>
</form>
```

---

### 🔹 Usando FormBuilder
O `FormBuilder` simplifica a criação de formulários.
```ts
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-form-reactive-fb',
  imports: [ReactiveFormsModule],
  templateUrl: './form-reactive-fb.component.html'
})
export class FormReactiveFBComponent {
  constructor(private fb: FormBuilder) {}

  formulario = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]]
  });

  salvar() {
    console.log(this.formulario.value);
  }
}
```

---

### 🔹 Agrupando campos com FormGroup
```ts
formulario = new FormGroup({
  nome: new FormControl(''),
  endereco: new FormGroup({
    rua: new FormControl(''),
    cidade: new FormControl('')
  })
});
```

No HTML:
```html
<div formGroupName="endereco">
  <input formControlName="rua" placeholder="Rua" />
  <input formControlName="cidade" placeholder="Cidade" />
</div>
```

---

### 🔹 Trabalhando com FormArray
O `FormArray` é útil para listas dinâmicas de campos.
```ts
import { FormArray } from '@angular/forms';

formulario = new FormGroup({
  telefones: new FormArray([new FormControl('')])
});

get telefones() {
  return this.formulario.get('telefones') as FormArray;
}

adicionarTelefone() {
  this.telefones.push(new FormControl(''));
}
```

HTML:
```html
<div formArrayName="telefones">
  <div *ngFor="let tel of telefones.controls; let i = index">
    <input [formControlName]="i" placeholder="Telefone" />
  </div>
</div>
<button type="button" (click)="adicionarTelefone()">Adicionar</button>
```

---

### 📌 Diferenças para Template-driven
| Característica         | Template-driven | Reactive Forms |
|------------------------|----------------|----------------|
| Configuração principal | HTML           | TypeScript     |
| Escalabilidade         | Baixa          | Alta           |
| Testabilidade          | Baixa          | Alta           |
| Validações             | No HTML        | No TypeScript  |

---

### 📌 Boas práticas
1. Usar Reactive Forms para formulários complexos e dinâmicos.
2. Centralizar regras de validação no TypeScript.
3. Usar `FormBuilder` para código mais limpo.
4. Usar `get` para acessar controles no template de forma mais legível.

---

✅ **Resumo:**  
O Reactive Forms oferece maior controle, escalabilidade e testabilidade, sendo ideal para formulários complexos no Angular.

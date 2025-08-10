## 📌 Data Binding no Angular

O **Data Binding** é o mecanismo que conecta os dados do componente TypeScript com o template HTML no Angular.  
Ele permite que as mudanças no código afetem automaticamente a interface e vice-versa.

---

### Tipos de Data Binding

#### 1. Interpolação (`{{ }}`)
Utilizada para exibir valores de variáveis ou expressões no template.
```ts
@Component({
  standalone: true,
  selector: 'app-interpolacao',
  template: `<h1>Olá, {{ nome }}</h1>`
})
export class InterpolacaoComponent {
  nome = 'Iuri';
}
```

---

#### 2. Property Binding (`[property]`)
Vincula valores do componente a propriedades de elementos HTML ou de outros componentes.
```ts
@Component({
  standalone: true,
  selector: 'app-property-binding',
  template: `<img [src]="urlImagem" alt="Imagem" />`
})
export class PropertyBindingComponent {
  urlImagem = 'https://angular.io/assets/images/logos/angular/angular.png';
}
```

---

#### 3. Event Binding (`(event)`)
Escuta eventos do DOM e executa métodos no componente.
```ts
@Component({
  standalone: true,
  selector: 'app-event-binding',
  template: `<button (click)="mostrarMensagem()">Clique aqui</button>`
})
export class EventBindingComponent {
  mostrarMensagem() {
    alert('Botão clicado!');
  }
}
```

---

#### 4. Two-way Data Binding (`[(ngModel)]`)
Permite que alterações no template e no componente se mantenham sincronizadas.
Necessita importar `FormsModule`.
```ts
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-two-way',
  imports: [FormsModule],
  template: `<input [(ngModel)]="nome" placeholder="Digite seu nome" />
             <p>Olá, {{ nome }}</p>`
})
export class TwoWayComponent {
  nome = '';
}
```

---

### Resumo visual
| Tipo                | Sintaxe              | Direção da atualização |
|---------------------|----------------------|------------------------|
| Interpolação        | `{{ valor }}`        | TS → HTML              |
| Property Binding    | `[propriedade]`      | TS → HTML              |
| Event Binding       | `(evento)`           | HTML → TS              |
| Two-way Data Binding| `[(ngModel)]`        | TS ↔ HTML              |

---

✅ **Resumo:**  
O Data Binding é essencial para conectar lógica e interface no Angular. Usar cada tipo de binding corretamente melhora a performance, a legibilidade e a manutenção do código.

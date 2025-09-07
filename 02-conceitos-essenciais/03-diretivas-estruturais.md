## 📌 Diretivas Estruturais no Angular (`*ngIf`, `*ngFor`)

As **diretivas estruturais** no Angular alteram a estrutura do DOM, adicionando, removendo ou manipulando elementos de acordo com alguma condição ou iteração.

---

### 🔹 *ngIf
Usada para renderizar ou remover elementos do DOM com base em uma condição booleana.

```ts
@Component({
  standalone: true,
  selector: 'app-exemplo-if',
  template: `
    <button (click)="mostrar = !mostrar">Alternar</button>
    <p *ngIf="mostrar">Este texto aparece quando 'mostrar' é true</p>
    <p *ngIf="!mostrar">Este texto aparece quando 'mostrar' é false</p>
  `
})
export class ExemploIfComponent {
  mostrar = true;
}
```

Também é possível usar `else`:
```ts
@Component({
  standalone: true,
  selector: 'app-exemplo-if-else',
  template: `
    <p *ngIf="logado; else naoLogado">Bem-vindo, usuário!</p>
    <ng-template #naoLogado>
      <p>Você precisa fazer login.</p>
    </ng-template>
  `
})
export class ExemploIfElseComponent {
  logado = false;
}
```

---

### 🔹 *ngFor
Usada para iterar sobre listas e renderizar elementos para cada item.

```ts
@Component({
  standalone: true,
  selector: 'app-exemplo-for',
  template: `
    <ul>
      <li *ngFor="let item of itens; let i = index">
        {{ i + 1 }} - {{ item }}
      </li>
    </ul>
  `
})
export class ExemploForComponent {
  itens = ['Item 1', 'Item 2', 'Item 3'];
}
```

Com `trackBy` para otimizar performance:
```ts
@Component({
  standalone: true,
  selector: 'app-exemplo-for-trackby',
  template: `
    <ul>
      <li *ngFor="let item of itens; trackBy: identificar">
        {{ item.nome }}
      </li>
    </ul>
  `
})
export class ExemploForTrackByComponent {
  itens = [
    { id: 1, nome: 'Item 1' },
    { id: 2, nome: 'Item 2' }
  ];

  identificar(index: number, item: any) {
    return item.id;
  }
}
```

---

### 📌 Boas práticas
1. Usar `trackBy` sempre que possível no `*ngFor` para melhorar performance.
2. Evitar lógicas complexas diretamente no template.
3. Usar `ng-template` para manipular o que é exibido no `*ngIf` quando falso.

---

✅ **Resumo:**  
- `*ngIf` → Renderiza ou remove elementos com base em uma condição.  
- `*ngFor` → Itera sobre coleções para gerar elementos dinamicamente.  
Ambas ajudam a criar interfaces dinâmicas e reativas no Angular.

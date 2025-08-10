## 📌 Diretivas de Atributo no Angular (`[ngClass]`, `[ngStyle]`)

As **diretivas de atributo** no Angular alteram a aparência ou comportamento de um elemento, componente ou diretiva já existente, sem mudar sua estrutura no DOM.

---

### 🔹 [ngClass]
Permite adicionar ou remover classes CSS dinamicamente com base em expressões.

```ts
@Component({
  standalone: true,
  selector: 'app-exemplo-ngclass',
  template: `
    <button (click)="ativo = !ativo">Alternar Estado</button>
    <p [ngClass]="{ 'ativo': ativo, 'inativo': !ativo }">
      O estado está {{ ativo ? 'Ativo' : 'Inativo' }}
    </p>
  `,
  styles: [
    `.ativo { color: green; font-weight: bold; }`,
    `.inativo { color: red; font-style: italic; }`
  ]
})
export class ExemploNgClassComponent {
  ativo = false;
}
```

Também é possível passar uma string ou array de classes:
```ts
<p [ngClass]="'classe-fixa outra-classe'">Texto</p>
<p [ngClass]="['classe1', 'classe2']">Outro texto</p>
```

---

### 🔹 [ngStyle]
Permite aplicar estilos CSS dinamicamente.

```ts
@Component({
  standalone: true,
  selector: 'app-exemplo-ngstyle',
  template: `
    <button (click)="aumentarFonte()">Aumentar Fonte</button>
    <p [ngStyle]="{ 'font-size.px': tamanhoFonte, 'color': corTexto }">
      Texto com estilo dinâmico
    </p>
  `
})
export class ExemploNgStyleComponent {
  tamanhoFonte = 14;
  corTexto = 'blue';

  aumentarFonte() {
    this.tamanhoFonte += 2;
    this.corTexto = this.corTexto === 'blue' ? 'purple' : 'blue';
  }
}
```

---

### 📌 Boas práticas
1. Usar `[ngClass]` e `[ngStyle]` para evitar lógica de manipulação direta do DOM.
2. Centralizar estilos em classes CSS e usar `[ngClass]` para alternar entre elas.
3. Para múltiplas condições, preferir objetos no `[ngClass]` e `[ngStyle]` pela clareza.

---

✅ **Resumo:**  
- `[ngClass]` → Aplica classes CSS dinamicamente.  
- `[ngStyle]` → Aplica estilos inline dinamicamente.  
Ambas ajudam a criar interfaces dinâmicas, adaptáveis e mais manuteníveis.

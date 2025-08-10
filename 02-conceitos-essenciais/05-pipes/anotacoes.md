## 📌 Pipes no Angular (nativos e customizados)

Os **Pipes** no Angular são usados para transformar valores exibidos no template, sem modificar os dados originais no componente.

---

### 🔹 Pipes nativos
O Angular oferece diversos pipes prontos para uso:

| Pipe       | Exemplo de uso                    | Saída              |
|------------|-----------------------------------|--------------------|
| `date`     | `{{ hoje | date:'dd/MM/yyyy' }}`  | 10/08/2025         |
| `uppercase`| `{{ 'angular' | uppercase }}`     | ANGULAR            |
| `lowercase`| `{{ 'ANGULAR' | lowercase }}`     | angular            |
| `currency` | `{{ 1500 | currency:'BRL' }}`     | R$ 1.500,00        |
| `percent`  | `{{ 0.25 | percent }}`            | 25%                |
| `json`     | `{{ objeto | json }}`             | JSON formatado     |
| `slice`    | `{{ lista | slice:1:3 }}`         | Elementos de 1 a 3 |

Exemplo com `date` e `currency`:
```ts
@Component({
  standalone: true,
  selector: 'app-exemplo-pipes-nativos',
  template: `
    <p>Data formatada: {{ hoje | date:'fullDate' }}</p>
    <p>Preço: {{ preco | currency:'BRL':'symbol':'1.2-2' }}</p>
  `
})
export class ExemploPipesNativosComponent {
  hoje = new Date();
  preco = 1999.99;
}
```

---

### 🔹 Pipes customizados
Podemos criar pipes personalizados para aplicar transformações específicas.

Exemplo: Pipe para capitalizar a primeira letra de cada palavra.
```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
  standalone: true
})
export class CapitalizePipe implements PipeTransform {
  transform(valor: string): string {
    if (!valor) return '';
    return valor.replace(/\b\w/g, letra => letra.toUpperCase());
  }
}
```

Uso no componente:
```ts
@Component({
  standalone: true,
  selector: 'app-exemplo-pipe-customizado',
  template: `<p>{{ 'angular é incrível' | capitalize }}</p>`,
  imports: [CapitalizePipe]
})
export class ExemploPipeCustomizadoComponent { }
```
Saída:
```
Angular É Incrível
```

---

### 📌 Boas práticas
1. Usar pipes para **formatação de exibição**, não para lógica de negócio.
2. Evitar pipes muito pesados que rodem em cada ciclo de detecção de mudanças.
3. Criar pipes puros (`pure: true`) sempre que possível, para otimizar performance.

---

✅ **Resumo:**  
- **Pipes nativos** → já vêm no Angular para formatações comuns.  
- **Pipes customizados** → permitem criar transformações específicas para seu projeto.  
Eles ajudam a manter o template mais limpo e o código mais organizado.

## 📌 Manipulação de Eventos no Template no Angular

O Angular permite capturar e responder a eventos do DOM diretamente no template, usando **event binding** com a sintaxe `(evento)`.

---

### 🔹 Sintaxe básica
```ts
@Component({
  standalone: true,
  selector: 'app-evento-basico',
  template: `<button (click)="mostrarAlerta()">Clique aqui</button>`
})
export class EventoBasicoComponent {
  mostrarAlerta() {
    alert('Botão clicado!');
  }
}
```

---

### 🔹 Passando parâmetros para o método
```ts
@Component({
  standalone: true,
  selector: 'app-evento-parametro',
  template: `<button (click)="saudar('Iuri')">Saudar</button>`
})
export class EventoParametroComponent {
  saudar(nome: string) {
    alert('Olá, ' + nome + '!');
  }
}
```

---

### 🔹 Usando o objeto de evento `$event`
O Angular passa automaticamente o evento do DOM para o método quando usamos `$event`.
```ts
@Component({
  standalone: true,
  selector: 'app-evento-evento',
  template: `<input (input)="aoDigitar($event)" placeholder="Digite algo" />`
})
export class EventoEventoComponent {
  aoDigitar(evento: Event) {
    const valor = (evento.target as HTMLInputElement).value;
    console.log('Valor digitado:', valor);
  }
}
```

---

### 🔹 Eventos comuns
- `click` → Clique em elementos.
- `input` → Alterações em campos de texto.
- `change` → Mudança de valor em `<input>` ou `<select>`.
- `keyup` / `keydown` → Teclas pressionadas ou liberadas.
- `mouseover` / `mouseout` → Passar o mouse sobre/fora de um elemento.
- `submit` → Envio de formulários.

---

### 🔹 Prevenindo comportamento padrão
Podemos usar `$event.preventDefault()` para impedir o comportamento padrão do navegador.
```ts
@Component({
  standalone: true,
  selector: 'app-prevenir-evento',
  template: `<a href="https://angular.io" (click)="prevenir($event)">Não vá!</a>`
})
export class PrevenirEventoComponent {
  prevenir(evento: Event) {
    evento.preventDefault();
    alert('Navegação bloqueada!');
  }
}
```

---

### 📌 Boas práticas
1. Evitar lógica complexa diretamente no template, preferindo métodos no componente.
2. Usar nomes de métodos descritivos para facilitar manutenção.
3. Garantir que eventos não gerem efeitos colaterais inesperados.

---

✅ **Resumo:**  
A manipulação de eventos no Angular é feita com **event binding**, permitindo conectar ações do usuário a métodos do componente. É uma das formas mais comuns de interação em aplicações Angular.

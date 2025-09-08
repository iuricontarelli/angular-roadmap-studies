## 📌 Uso de `Subject` e `BehaviorSubject` no RxJS/Angular

O **Subject** é uma ponte entre **Observables** e **Observers**: ele é ao mesmo tempo **emissor** (`.next()`) e **Observable** que outros podem assinar.  
O **BehaviorSubject** é uma variação que **guarda o último valor emitido**, entregando-o imediatamente a novos assinantes.

---

## 1) `Subject`
- Multicast: vários assinantes compartilham o mesmo fluxo.
- Não armazena valores antigos: novos inscritos só recebem valores **futuros**.

```ts
import { Subject } from 'rxjs';

const evento$ = new Subject<string>();

// Inscreve-se no fluxo
evento$.subscribe(v => console.log('A:', v));

evento$.next('primeiro'); // "A: primeiro"

// Novo inscrito só recebe daqui pra frente
evento$.subscribe(v => console.log('B:', v));

evento$.next('segundo');  // "A: segundo" / "B: segundo"
```

---

## 2) `BehaviorSubject`
- Igual ao Subject, mas exige um **valor inicial**.
- Sempre reenvia o **último valor** a novos inscritos.

```ts
import { BehaviorSubject } from 'rxjs';

const estado$ = new BehaviorSubject<number>(0); // valor inicial 0

estado$.subscribe(v => console.log('A:', v)); // "A: 0"

estado$.next(1); // "A: 1"
estado$.next(2); // "A: 2"

estado$.subscribe(v => console.log('B:', v)); // "B: 2" (recebe último imediatamente)
```

---

## 3) Uso prático em Angular — estado compartilhado

### Com **Subject** (eventos pontuais)
```ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificacaoService {
  private _notificar$ = new Subject<string>();
  notificar$ = this._notificar$.asObservable();

  enviar(msg: string) {
    this._notificar$.next(msg);
  }
}
```

Uso no componente:
```ts
@Component({
  standalone: true,
  selector: 'app-header',
  template: `<p *ngIf="msg">{{ msg }}</p>`
})
export class HeaderComponent {
  msg = '';
  constructor(private notif: NotificacaoService) {
    this.notif.notificar$.subscribe(m => this.msg = m);
  }
}
```

---

### Com **BehaviorSubject** (estado atual)
```ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TemaService {
  private _tema$ = new BehaviorSubject<'claro' | 'escuro'>('claro');
  tema$ = this._tema$.asObservable();

  alternar() {
    const novo = this._tema$.value === 'claro' ? 'escuro' : 'claro';
    this._tema$.next(novo);
  }
}
```

Uso no componente com **AsyncPipe**:
```ts
@Component({
  standalone: true,
  selector: 'app-toolbar',
  template: `
    <button (click)="srv.alternar()">Alternar tema</button>
    <p>Tema: {{ srv.tema$ | async }}</p>
  `
})
export class ToolbarComponent {
  constructor(public srv: TemaService) {}
}
```

---

## 4) Diferenças resumidas

| Característica        | Subject           | BehaviorSubject |
|-----------------------|------------------|-----------------|
| Valor inicial         | ❌ Não           | ✅ Sim          |
| Último valor guardado | ❌ Não           | ✅ Sim          |
| Uso típico            | Eventos          | Estado          |

---

## 5) Boas práticas
1. Use **Subject** para **eventos transitórios** (cliques, notificações, refresh).  
2. Use **BehaviorSubject** para **estado atual** (tema, usuário logado, carrinho).  
3. Sempre exponha o **Observable público** (`asObservable()`) e esconda o `.next()` dentro do serviço.  
4. Evite abusar de `BehaviorSubject` para tudo → para estados complexos, prefira soluções mais robustas (Signals ou NGRX).  
5. Em Angular moderno, considere **Signals** como alternativa a BehaviorSubject para estado local/global.  

---

✅ **Resumo**
- **Subject**: multicast, não guarda estado.  
- **BehaviorSubject**: multicast + guarda último valor.  
- Angular: use Subjects em eventos e BehaviorSubject em estados.  
- Sempre encapsule e exponha apenas o Observable público para manter imutabilidade externa.

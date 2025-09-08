## 📌 Design Patterns no Angular

Design patterns ajudam a manter o código **escalável, limpo e testável**.  
Alguns aplicáveis no Angular:

---

## 1) Singleton Service
Serviços Angular já são **singleton** por padrão (quando `providedIn: 'root'`).  
Use para autenticação, cache global, tema, etc.

---

## 2) Facade Pattern
Crie uma **fachada** para encapsular lógica complexa de uma feature.  
Evita múltiplos componentes acessando serviços diretamente.

```ts
@Injectable({ providedIn: 'root' })
export class ProdutosFacade {
  private api = inject(ProdutosApiService);
  produtos$ = this.api.listar();
  carregar() { return this.api.listar(); }
}
```

Uso no componente:
```ts
this.facade.produtos$.subscribe();
```

---

## 3) Observer (RxJS)
Observables e Subjects implementam Observer Pattern nativamente.  
Use para eventos e comunicação entre componentes.

---

## 4) Strategy Pattern
Troque algoritmos dinamicamente sem alterar a interface.

```ts
interface FreteStrategy { calcular(valor: number): number; }

class FreteNormal implements FreteStrategy {
  calcular(valor: number) { return valor * 0.1; }
}
class FreteExpresso implements FreteStrategy {
  calcular(valor: number) { return valor * 0.2; }
}
```

---

## 5) Module Pattern (feature-based)
Organize código em **features isoladas** com `routes.ts`, `services/`, `models/`.  
Facilita escalabilidade e separação de responsabilidades.

---

## 6) Dependency Injection
Angular já implementa DI nativamente.  
Permite **testes fáceis** e baixo acoplamento.

---

## 7) Boas práticas
- Aplique patterns **quando há necessidade real**, não por moda.  
- Prefira **simplicidade**: signals + services resolvem 80% dos casos.  
- Documente o padrão e motive seu uso.

---

✅ **Resumo**
No Angular, use patterns como **Facade**, **Observer (RxJS)** e **Strategy** para clareza.  
Combine com **DI** e **organização por feature** para manter apps limpos e escaláveis.
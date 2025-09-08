## 📌 State Management no Angular (NGRX, NGXS, SignalsStore)

Gerenciar estado em apps grandes exige **clareza e previsibilidade**.  
Três abordagens populares:

---

## 1) NGRX (Redux-like)
- Baseado em **Actions → Reducers → Store**.  
- Estado centralizado, imutável.  
- Ótimo para apps complexos, mas verboso.

```ts
// exemplo de reducer
export const contadorReducer = createReducer(
  0,
  on(incrementar, (state) => state + 1),
  on(decrementar, (state) => state - 1)
);
```

---

## 2) NGXS
- API mais simples e declarativa.  
- Menos boilerplate que NGRX.  
- Funciona com decorators e classes.

```ts
@State<number>({ name: 'contador', defaults: 0 })
@Injectable()
export class ContadorState {
  @Action(Incrementar) incrementar(ctx: StateContext<number>) {
    ctx.setState(state => state + 1);
  }
}
```

---

## 3) SignalsStore (NGRX Signals)
- Baseado em **Signals**.  
- Menos boilerplate, APIs modernas.  
- Ideal para estado **por feature**.

```ts
export const ContadorStore = signalStore(
  withState({ valor: 0 }),
  withMethods((store) => ({
    inc: () => patchState(store, { valor: store.valor() + 1 })
  }))
);
```

---

## 4) Boas práticas
- Use **NGRX** em apps grandes/corporativos.  
- Use **SignalsStore** em features isoladas.  
- Prefira **imutabilidade** sempre.  

---

✅ **Resumo**
Escolha o **nível de complexidade** conforme seu app: NGRX (enterprise), NGXS (intermediário), SignalsStore (moderno e simples).
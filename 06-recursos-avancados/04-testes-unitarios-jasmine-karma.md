## 📌 Testes Unitários no Angular (Jasmine/Karma)

O Angular CLI já vem configurado com **Jasmine** (framework de testes) e **Karma** (runner).  
Objetivo: validar componentes, serviços e pipes de forma **isolada**.

---

## 1) Estrutura padrão
```bash
ng test
```
Executa todos os arquivos `*.spec.ts`.

---

## 2) Exemplo de teste em serviço
```ts
describe('CalculadoraService', () => {
  let service: CalculadoraService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CalculadoraService] });
    service = TestBed.inject(CalculadoraService);
  });

  it('deve somar corretamente', () => {
    expect(service.somar(2, 3)).toBe(5);
  });
});
```

---

## 3) Exemplo em componente
```ts
it('deve renderizar título', () => {
  const fixture = TestBed.createComponent(AppComponent);
  fixture.detectChanges();
  const compiled = fixture.nativeElement as HTMLElement;
  expect(compiled.querySelector('h1')?.textContent).toContain('Angular');
});
```

---

## 4) Boas práticas
- Testar **unidade isolada**, não integração.  
- Usar **spies/mocks** para dependências externas.  
- Evitar testar **detalhes de implementação** (foco em comportamento).

---

✅ **Resumo**
Testes unitários garantem **confiabilidade** em serviços/pipes/lógica de componentes, com execução rápida via Jasmine/Karma.
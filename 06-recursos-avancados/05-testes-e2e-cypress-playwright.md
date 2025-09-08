## 📌 Testes End-to-End (E2E) com Cypress/Playwright

Testes **E2E** validam o app Angular rodando completo, simulando um **usuário real** no navegador.

---

## 1) Cypress
- Fácil de configurar.  
- API intuitiva (commands).  
- Bom para times front-end.

```bash
npm i -D cypress
npx cypress open
```

Exemplo:
```ts
describe('Login', () => {
  it('deve logar com credenciais válidas', () => {
    cy.visit('/login');
    cy.get('input[name=email]').type('user@teste.com');
    cy.get('input[name=senha]').type('123456');
    cy.get('button[type=submit]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

---

## 2) Playwright
- Mantido pela Microsoft.  
- Suporte multi-navegador e mobile.  
- Bom para testes mais robustos/CI.

```bash
npm i -D @playwright/test
npx playwright test
```

Exemplo:
```ts
import { test, expect } from '@playwright/test';

test('login com sucesso', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name=email]', 'user@teste.com');
  await page.fill('input[name=senha]', '123456');
  await page.click('button[type=submit]');
  await expect(page).toHaveURL(/.*dashboard/);
});
```

---

## 3) Boas práticas
- Mantenha **fixtures** (usuários/mock data).  
- Use **CI/CD** para rodar testes E2E.  
- Não exagere na quantidade — foque nos fluxos críticos.

---

✅ **Resumo**
Use Cypress para times **rápidos/front-end** e Playwright para cenários **multi-browser** e pipelines CI/CD avançados.
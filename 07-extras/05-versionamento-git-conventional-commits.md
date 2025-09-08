## 📌 Versionamento com Git + Conventional Commits

Padronize mensagens de commit para melhorar **histórico**, **changelog** e **releases** automatizadas.

---

## 1) Padrão (resumo)
```
<tipo>(escopo opcional): <descrição no imperativo>

[corpo opcional]
[rodapé opcional]
```
**Tipos comuns**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`, `ci`, `perf`, `style`.

Exemplos:
```
feat(produtos): adiciona filtro por faixa de preço
fix(api): corrige 401 ao renovar token
docs: adiciona guia de instalação do projeto
refactor(core): migra serviço de tema para signals
```

---

## 2) Ferramentas úteis
- **commitlint** + **husky** para validar commits em *pre-commit*/*commit-msg*.
```bash
npm i -D @commitlint/cli @commitlint/config-conventional husky
npx husky install
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.cjs
npx husky add .husky/commit-msg "npx commitlint --edit $1"
```
- **semantic-release** para gerar **changelogs** e **tags** automáticas.
- **standard-version** (alternativa mais simples).

---

## 3) Branching e PRs
- **main** (estável), **develop** (opcional), **feature/***, **fix/***.
- PRs com **descrição clara**, **checklist** e **review** obrigatório.

---

## 4) Versionamento semântico
- **MAJOR**: quebras de compatibilidade.  
- **MINOR**: novas funcionalidades retrocompatíveis.  
- **PATCH**: correções de bugs.

---

✅ **Resumo**: Mensagens padronizadas + ferramentas = histórico limpo, *releases* previsíveis e colaboração eficiente.

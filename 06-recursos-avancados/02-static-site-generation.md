## 📌 Static Site Generation (SSG)

**Static Site Generation** pré-renderiza páginas Angular em **HTML estático** no momento do build.  
Benefícios:
- Performance máxima (servido como arquivo estático).  
- Excelente para blogs, documentações e landing pages.  
- SEO forte.

---

## 1) Ativando SSG
Angular Universal também suporta **prerender**:
```bash
ng run app:prerender
```

Isso gera arquivos HTML prontos em `dist/browser/`.

---

## 2) Estratégias comuns
- **Full prerender**: todas as rotas conhecidas viram HTML.  
- **Hybrid**: algumas rotas estáticas + SSR dinâmico para páginas com dados.  

---

## 3) Boas práticas
- Use SSG para conteúdo **imutável** ou pouco atualizado.  
- Combine com **Incremental Static Regeneration (ISR)** em plataformas modernas.  
- Gere sitemap para SEO.

---

✅ **Resumo**
SSG entrega páginas Angular ultra rápidas, ideais para **conteúdo estático** e SEO, reduzindo custo de servidor.
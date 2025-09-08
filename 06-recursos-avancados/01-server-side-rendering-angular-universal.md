## 📌 Server-Side Rendering (Angular Universal)

**Server-Side Rendering (SSR)** é o processo de renderizar a aplicação Angular no **servidor** antes de enviá-la ao cliente.  
Benefícios principais:
- Melhor **SEO** (conteúdo visível para crawlers).  
- Melhor **Time to First Paint** (conteúdo inicial renderizado mais rápido).  
- Melhor experiência em conexões lentas.

---

## 1) Instalação e configuração
```bash
ng add @nguniversal/express-engine
```

Isso adiciona suporte a SSR com Node.js/Express.

---

## 2) Estrutura gerada
```
src/
 ├── main.ts             # bootstrap padrão (browser)
 ├── main.server.ts      # bootstrap do servidor
 ├── app.server.module.ts
server.ts                # servidor Express
```

---

## 3) Build e execução
```bash
npm run build:ssr
npm run serve:ssr
```

---

## 4) Boas práticas
- Use `isPlatformBrowser`/`isPlatformServer` para diferenciar comportamentos.  
- Evite acessar `window`/`document` diretamente no SSR.  
- Combine com cache/CDN para melhor escalabilidade.

---

✅ **Resumo**
SSR com Angular Universal melhora SEO, performance inicial e acessibilidade.  
Requer Node.js no servidor ou integração com plataformas de edge (Vercel, Netlify, Cloudflare).
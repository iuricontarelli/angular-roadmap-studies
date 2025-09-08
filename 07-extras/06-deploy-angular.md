## 📌 Deploy do app Angular (Vercel, Netlify, S3/CloudFront)

Guia rápido para publicar seu app Angular em hospedagens comuns.

---

## 1) Build de produção
```bash
ng build --configuration=production
```
Saída em `dist/<app>/browser` (Angular moderno).

---

## 2) Vercel
- Crie projeto no Vercel e importe o repo.
- **Build Command**: `ng build --configuration=production`
- **Output Directory**: `dist/<app>/browser`
- Para SSR/SSG (Angular Universal), use **Adaptador Vercel** do Angular/Builders específicos.

`vercel.json` (SPA sem SSR – redireciono 404 ao index):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 3) Netlify
- **Publish directory**: `dist/<app>/browser`
- Regras de SPA (`_redirects` no diretório publicado):
```
/*    /index.html   200
```

---

## 4) S3 + CloudFront
1. Build de produção.  
2. Suba o conteúdo de `dist/<app>/browser` para um **bucket S3** com **website hosting**.  
3. Configure **CloudFront** apontando para o bucket.  
4. Regras de erro → redirecionar 403/404 para `/index.html` (SPA).  
5. **Cache**: configure *cache policies* e invalidação no deploy.

---

## 5) Dicas gerais
- Verifique **`<base href="/">`** no `index.html` conforme subpasta.  
- Use **variáveis de ambiente** de CI para `environment` e chaves.  
- Ative **compressão** (brotli/gzip) no CDN.  
- Monitore com **Lighthouse** após publicar.

---

✅ **Resumo**: Build de produção + regras de SPA resolvem 90% dos casos. Para SSR/SSG, use adaptadores/plataformas compatíveis e configure rewrites adequados.

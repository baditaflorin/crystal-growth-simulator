# Deploy

Live site:

https://baditaflorin.github.io/crystal-growth-simulator/

GitHub Pages source:

`main` branch, `/docs` folder.

## Publish

```bash
npm install
make lint
make test
make build
git add .
git commit -m "feat: update simulator"
git push origin main
```

GitHub Pages republishes from `docs/` after the push.

## Rollback

Revert the commit that changed `docs/`, then push `main` again:

```bash
git revert <commit>
git push origin main
```

## Custom Domain

If a custom domain is added later, create `docs/CNAME` with the domain and configure DNS with the records shown by GitHub Pages. GitHub Pages does not support `_headers` or `_redirects`; use `404.html` for SPA fallback.

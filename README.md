# book-review

Run locally

`pnpm start`

** Deploy to staging

```bash
firebase use reactauthdevelopment
pnpm stage
firebase deploy
```

** Deploy to production

```bash
firebase use reactdemo-72418
pnpm build
firebase deploy
```

** Firebase commands

- firebase projects:list
- firebase use `projectname`
- firebase login
- firebase init

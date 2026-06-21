

```bash
$ npm install
```

```bash
# development
$ n run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

```bash
git branch # check branch
git branch your-new-branch-name # create new branch
git switch your-new-branch-name # switch to new branch
git switch -c your-new-branch-name # create and switch to new branch
```

```bash
git push -u origin your-branch-name # push specificbranch to github
#create pr
gh pr create --head your-new-branch --base main --title "feat: Add authentication" --body "Details here"
# merge current branch's pr to main
gh pr merge --merge --delete-branch
gh pr merge 12 --merge --delete-branch #add pr number
gh pr list # list all prs
```
```bash
npx nest g module moduleName # generate module and imports in main app module
```
```bash
npm add prisma @types/pg --save-dev
npm add @prisma/client @prisma/adapter-pg pg dotenv
```

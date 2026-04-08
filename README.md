# poker

This is not an application to play poker
This is an app for poker planning in an agile project


## Try it 
```sh
docker pull ghcr.io/totorobin/poker:latest
docker run -p 8080:8080 -d ghcr.io/totorobin/poker:latest
```

## Project Setup

Ce projet est un monorepo géré par [pnpm](https://pnpm.io/).

### Installation des dépendances

À la racine du projet :
```sh
pnpm install
```

### Développement

Lancer tous les services (client et serveur) en mode développement :
```sh
pnpm dev
```

Ou individuellement :
```sh
pnpm --filter client dev
pnpm --filter server dev
```

### Build

Pour construire tout le projet :
```sh
pnpm build
```

### Lint et Formatage

```sh
pnpm lint
pnpm format
```

### Dockerize

```sh
docker build . -t poker
```

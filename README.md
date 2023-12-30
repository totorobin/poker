# poker

This is not an application to play poker
This is an app for poker planning in an agile project


## Try it 
```sh
docker pull ghcr.io/totorobin/poker:latest
docker run -p 8080:8080 -d ghcr.io/totorobin/poker:latest
```

## Project Setup


### Server side

```sh
cd ./server
npm install
```

#### Compile and Hot-Reload for Development

```sh
npm run dev
```

#### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Client side

```sh
cd ./client
npm install
```

#### Compile and Hot-Reload for Development

```sh
npm run dev
```
! server needs to run for client to work

#### Type-Check, Compile and Minify for Production

```sh
npm run build
```

#### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```


### Dockerize

```sh
docker build . -t totoro/poker --network host
```

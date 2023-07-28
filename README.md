<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

Tasking API built with NestJS, TypeORM, GraphQL, and PostgreSQL.

# Dev

1. Clonar el proyecto

2. Copiar el `.env.example` a `.env`

3. Instalar dependencias

```bash
$ npm install
```

4. Levantar la imagen de docker

```bash
$ docker-compose up -d
```

5. Correr la aplicación:

```bash
# development
$ npm run start

# watch mode (nodemon)
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests (jest)
$ npm run test

# e2e tests (jest)
$ npm run test:e2e

# test coverage (jest)
$ npm run test:cov
```

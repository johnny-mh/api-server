# auth

A web server that provides basic authentication features, including a token refresh function.

## Prerequisites

- bun>=1.1.42
- docker

## Run the server

```bash

git clone https://github.com/johnny-mh/api-server.git

cd api-server

bun install

cd server/auth

docker compose up -d database

cd ../../

bun dev
```

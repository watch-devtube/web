[![Build Status](https://travis-ci.org/watch-devtube/web.svg?branch=master)](https://travis-ci.org/watch-devtube/web)

# Dev.Tube

> Dev.Tube is where all developer videos live.

## How to run the app locally?

This web app comprises of `Vue` client app and a slim `node` server app, through which the client app is served.

``` bash
# make sure yarn is installed
npm install --global yarn

# install dependencies and run client app 
yarn && yarn dev

# go to server app
cd express

# download test data
mkdir data
curl -f --output data/loki.json https://storage.googleapis.com/dev-tube-index/loki-test.json
curl -f --output data/lunr.json https://storage.googleapis.com/dev-tube-index/lunr-test.json
curl -f --output data/board.json https://storage.googleapis.com/dev-tube-index/board.json

# install dependencies and server app
yarn && yarn dev
```

Voila! The app is available via port `8100`.

## How to contribute content?

The info is [here](https://github.com/watch-devtube/contrib).


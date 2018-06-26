# Dev.Tube

> Hi! I am Dev.Tube – the place where developer videos live.

This web app comprises of `Vue` client app and a slim `node` server app, through which the client app is served.

## How to run the app locally?

``` bash
# make sure yarn is installed
npm install --global yarn

# install client app dependencies
yarn

# run client app
yarn run dev

# go to server app
cd express

# install server app dependencies 
yarn

# run server app on
yarn run dev
```

Voila! The app is available via port `8100`.

## How to deploy the app to production?

``` bash
# make sure serverless is installed
npm install --global serverless

# build client app
yarn && yarn build

# build server app
cd express && yarn && yarn compile

# deploy server app as Google cloud function
serverless deploy

```

## How to contribute content?
The info is [here](https://github.com/watch-devtube/contrib).


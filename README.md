[![Build Status](https://travis-ci.org/watch-devtube/web.svg?branch=master)](https://travis-ci.org/watch-devtube/web)

# Dev.Tube

This repository contains `Vue.js` frontend and `Express.js` backend for DevTube.

### Get datastore access

Ask the repo owners for Google Datastore credentials, then put them in `./datastore_key.json`.

### Configure env variables

Create a file ./express/.env with the following variables:

```
COOKIE_SECRET = DEVDEVDEVDEVDEVDEVDEVDEVDEVDEVDE
DEVTUBE_HOST = http://devtube.xxx:8080

YOUTUBE_API_KEY = <ask repo owners>

TWITTER_CONSUMER_KEY = <ask repo owners>
TWITTER_CONSUMER_SECRET = <ask repo owners>

GH_CLIENT_ID = <ask repo owners>
GH_CLIENT_SECRET = <ask repo owners>

GOOGLE_CLIENT_ID = <ask repo owners>
GOOGLE_CLIENT_SECRET = <ask repo owners>
```

### Add new entries to /etc/hosts file

```
127.0.0.1 devtube.xxx
127.0.0.1 api.devtube.xxx
```

#### Run backend

```bash
# From ./express directory run:
npm install
npm run dev
```

#### Run frontend

```bash
# from ./vue directory run:
npm install
npm run dev
```

> 🚀 DevTube front-end is now running on [devtube.xxx:8080](http://devtube.xxx:8080)

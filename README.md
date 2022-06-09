[![Build Status](https://travis-ci.org/watch-devtube/web.svg?branch=master)](https://travis-ci.org/watch-devtube/web)

# DevTube

This repository contains `Vue.js` frontend and `Express.js` backend for DevTube.

# Why DevTube?

DevTube contains the best `350+` tech talks from different sources – @eduardsi's personal favorites, github lists, YouTube most liked. You can say that DevTube is YouTube uncluttered + some secret gems reuploaded from InfoQ, Vimeo, and private video archives. The talks are updated and contributed regularly thanks to the community.

**💎 Discover hidden gems** – Watch videos that are not publicly available on YouTube (e.g. [Chad Fowler's "Tiny"](https://dev.tube/video/NXSS01n97G0)).

**🕛 Save time** – Watch only the best talks, curated by the community, grouped by categories and speakers. Quality beats quantity.

**🔖 Create lists** – Watch later, bookmark, and keep track of watched videos.

**💬 Discuss** – Read, write, and reply to comments directly from DevTube.

**❤️ Contribute** – Get karma for video contributions. Your name will also be visible next to the video.

**🔔 Subscribe** – Stay up-to-date with the latest videos via RSS. Too busy? Receive one tech talk per week.

**🧘 Fewer distractions** – No annoying YouTube algorithms, irrelevant videos, ads, and tracking.

# How to run DevTube locally

### Get datastore access

Ask the repo owners for Google Datastore credentials, then put them in `./datastore_key.json`.

### Configure env variables

Create a file `./express/.env` with the following variables:

```
COOKIE_SECRET = DEVDEVDEVDEVDEVDEVDEVDEVDEVDEVDE
DEVTUBE_HOST = http://devtube.xxx:8080

YOUTUBE_API_KEY = <ask repo owners>

TWITTER_CONSUMER_KEY = <ask repo owners>
TWITTER_CONSUMER_SECRET = <ask repo owners>

GH_CLIENT_ID = <ask repo owners>
GH_CLIENT_SECRET = <ask repo owners>

GOOG_CLIENT_ID = <ask repo owners>
GOOG_CLIENT_SECRET = <ask repo owners>
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

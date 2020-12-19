[![Build Status](https://travis-ci.org/watch-devtube/web.svg?branch=master)](https://travis-ci.org/watch-devtube/web)

# Dev.Tube

This repository contains `Vue.js` frontend and `Express.js` backend for DevTube.

## Table of content

- [How to run DevTube locally](#how-to-run-devtube-locally)
  - [Install global dependencies](#install-global-dependencies)
  - [Firebase: Authentication](#firebase-authentication)
  - [Firebase: Firestore](#firebase-firestore)
  - [Firebase: Connect DevTube](#firebase-connect-devtube)
  - [Datastore: Download data](#datastore-download-data)
  - [Datastore: Run emulator](#datastore-run-emulator)
  - [Run backend](#run-backend)
  - [Run frontend](#run-frontend)
- [How to contribute](#how-to-contribute)
- [How to contribute content](#how-to-contribute-content)

## How to run DevTube locally

#### Install global dependencies

Install Yarn:

```bash
npm install -g yarn
```

Install [Google Cloud SDK](https://cloud.google.com/sdk/install):

```bash
brew cask install google-cloud-sdk
```

#### Firebase: Authentication

DevTube uses Firebase for OAuth authentication. For now, Google, Twitter, and GitHub providers are supported. For development purposes, it's enough to configure GitHub provider.

1. [Create a new GitHub OAuth app](https://github.com/settings/applications/new). GitHub will ask you to provide _Authorization callback URL_.
2. [Create a new Firebase account](https:///firebase.google.com).
3. Go to Authentication and enable GitHub sign-in. Copy _Authorization callback URL_.
4. Go to Github and finalize app creation by providing _Authorization callback URL_.
5. Copy _Client ID_ and _Client Secret_.
6. Go to Firebase and provide those values.

#### Firebase: Firestore

DevTube stores your subscriptions, favorites, and watched videos in Firestore.

1. Open your Firebase account
2. Ceate a new Firestore database
3. Provide the following database permissions:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

#### Firebase: Connect DevTube

1. Open your Firebase account
2. Generate a new private key under Service accounts panel
3. Store downloaded credentials under `devtube-web/express/firebase.json`.
4. Create `devtube-web/firebase.config.json` file with and populate it with the content:

```json
{
  "projectId": "<firebase projectId>",
  "apiKey": "<firebase apiKey>",
  "authDomain": "<firebase projectId>.firebaseapp.com",
  "databaseURL": "https://<firebase projectId>.firebaseio.com"
}
```

#### Datastore: Download data

DevTube data lives in Cloud Datastore. Download and unzip the following test data:

```bash
curl --create-dirs -f -o express/data/loki.json https://storage.googleapis.com/dev-tube-index/loki-test.json

curl --create-dirs -f -o express/data/lunr.json https://storage.googleapis.com/dev-tube-index/lunr-test.json

curl --create-dirs -f -o express/data/data-test.zip https://storage.googleapis.com/dev-tube-index/data-test.zip

unzip express/data/data-test.zip -d "express/data/videos"
```

#### Datastore: Run emulator

```bash
# run emulator
gcloud beta emulators datastore start --project=dev-tube

# point environment variables to the emulator
$(gcloud beta emulators datastore env-init)

# populate Datastore Emulator
# From ./express directory run:
yarn
yarn run datastore-init
```

#### Run backend

You need to run backend first, because frontend relies on it.

```bash
# From ./express directory run:
yarn && yarn dev
```

#### Run frontend

```bash
# from project root directory, run:
yarn && yarn dev
```

> 🚀 DevTube front-end is now running on [localhost:8080](http://localhost:8080)

---

## How to contribute?

Before submitting PR, check the code for violations:

```bash
yarn lint
```

## How to contribute content?

You can contribute channels and speakers in [watch-devtube/contrib](https://github.com/watch-devtube/contrib) repo.

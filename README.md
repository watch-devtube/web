[![Build Status](https://travis-ci.org/watch-devtube/web.svg?branch=master)](https://travis-ci.org/watch-devtube/web)

# Dev.Tube

> Dev.Tube is where all developer videos live.

## How to run DevTube locally

#### Set up Firebase Authentication

DevTube depends on Firebase Authentication, because some of its functionality requires a user to be authenticated via one of three OAuth providers – Google, Twitter, or GitHub. For development purposes, it's enough to configure GitHub authentication.

1. Create new OAuth app in your GitHub account: github.com/settings/applications/new. GitHub will ask you to provide *Authorization callback URL*

3. Create a new Firebase account on firebase.google.com
4. In authentication panel, enable GitHub sign-in method. Copy *Authorization callback URL*.
5. Switch back to GitHub.com and paste the *Authorization callback URL*.
6. Copy *Client ID* and *Client Secret*; switch back to firebase.com and provide those values.

Create `devtube-web/firebase.config.json` file with and populate it with the content:

```json
{
  "projectId": "<projectId>",
  "apiKey": "<apiKey>",
  "authDomain": "<projectId>.firebaseapp.com",
  "databaseURL": "https://<projectId>.firebaseio.com"
}
```

#### Set up Firestore

1. In firebase, create a new Firestore database
2. Set the following permissions:

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

#### Set up a service account
1. In firebase, generate a new private key under Service accounts panel
2. Store downloaded credentials under `devtube-web/express/firebase.json`.

#### Install global dependencies

```bash
npm install -g yarn
```

```bash
# see cloud.google.com/sdk/install
brew cask install google-cloud-sdk
```

#### Download and unzip test data

```bash
curl --create-dirs -f -o express/data/loki.json https://storage.googleapis.com/dev-tube-index/loki-test.json

curl --create-dirs -f -o express/data/lunr.json https://storage.googleapis.com/dev-tube-index/lunr-test.json

curl --create-dirs -f -o express/data/data-test.zip https://storage.googleapis.com/dev-tube-index/data-test.zip

unzip express/data/data-test.zip -d "express/data/videos"
```

#### Prepare Cloud Datastore Emulator

```bash
# run emulator
gcloud beta emulators datastore start --project=dev-tube

# point environment variables to the emulator
$(gcloud beta emulators datastore env-init)

# populate datastore with data
cd express # if haven't done already
yarn run datastore-init
```

#### Run backend

DevTube is built of Vue.js frontend and Express.js backend. You need to run backend first, because frontend relies on it.

```bash
cd express # if haven't done already
yarn && yarn dev
```

### Run frontend

From a project root directory, run:

```bash
  yarn && yarn dev
```

DevTube is now running on [localhost:8100](http://localhost:8100)

---

## How to contribute?

Before submitting PR, check the code for violations:

```bash
  yarn lint
```

## How to contribute content?
You can contribute channels, speakers, and tags in [watch-devtube/contrib](https://github.com/watch-devtube/contrib) repo.


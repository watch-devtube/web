import axios from "axios";

const endpoint = window.location.href.includes("localhost")
  ? "//localhost:8100"
  : "//api.dev.tube";

export const bucket = axios.create({
  baseURL: "//storage.googleapis.com/dev-tube-index"
});

export const ads = axios.create({
  baseURL: "//raw.githubusercontent.com/watch-devtube/messages/master/"
});

export const dossier = axios.create({
  baseURL: "//dossier.dev.tube"
});

export const api = axios.create({
  baseURL: endpoint
});

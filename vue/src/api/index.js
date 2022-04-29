import axios from "axios";

export const bucket = axios.create({
  baseURL: "//storage.googleapis.com/dev-tube-index"
});

export const ads = axios.create({
  baseURL: "//raw.githubusercontent.com/watch-devtube/messages/master/"
});

export const dossier = axios.create({
  baseURL: "//dossier.glitch.me"
});

export const apiUrl = window.location.href.includes("localhost")
  ? "//localhost:8100"
  : "//api.dev.tube";

export const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true
});

export const apiAxios = () => axios;

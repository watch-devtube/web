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

export const api = axios.create({
  baseURL: window.location.href.includes("localhost")
    ? "//localhost:8100"
    : "//api.dev.tube/api"
});

export const apiAxios = () => axios;

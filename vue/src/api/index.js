import axios from "axios";

export const bucket = axios.create({
  baseURL: "//storage.googleapis.com/dev-tube-index"
});

export const devternity = axios.create({
  baseURL: "https://devternity.com"
});

export const dossier = axios.create({
  baseURL: "//dossier.glitch.me"
});

export const apiUrl = window.location.href.includes(".test")
  ? "//api.devtube.test:8100"
  : "//api.dev.tube";

export const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true
});

export const apiAxios = () => axios;

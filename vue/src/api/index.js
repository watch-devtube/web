import axios from "axios";
import Cookies from "js-cookie";

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
  : "//us-central1-dev-tube.cloudfunctions.net/api";

export const api = axios.create({
  baseURL: apiUrl
});
api.interceptors.request.use(function (config) {
  config.headers.jwt = Cookies.get("devtube-jwt");
  return config;
});

export const apiAxios = () => axios;

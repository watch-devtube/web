import axios from "axios";
import { authReady, jwtToken } from "../helpers/firebase";

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
  baseURL: window.location.href.includes("localhost")
    ? "//localhost:8100"
    : "//api.dev.tube"
});

function withAuthorization(axiosInstance) {
  axiosInstance.interceptors.request.use(async options => {
    options.headers["auth"] = await jwtToken();
    return options;
  });
  return axiosInstance;
}

export const apiAxios = () =>
  new Promise((resolve, reject) => {
    authReady()
      .then(() => resolve(withAuthorization(api)))
      .catch(reject);
  });

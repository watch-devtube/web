import axios from "axios";
import Vue from "vue";

export const bucket = axios.create({
  baseURL: "//storage.googleapis.com/dev-tube-index"
});

export const apiUrl = window.location.href.includes("devtube.xxx")
  ? "//devtube.xxx:8100/api/"
  : "//dev.tube/api/";

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  withCredentials: true
});

api.interceptors.response.use(
  response => response,
  error => {
    Vue.notify({
      group: "notification",
      title: "Oops! Something went wrong.",
      type: "error",
      text: "Please see logs and submit an issue: bit.ly/devtube-issue"
    });
    return Promise.reject(error);
  }
);

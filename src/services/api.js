import axios from "axios";
import store from "../store";
import { DELETE_TOKEN, SET_TOKEN } from "../store/auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_KEY,
  withCredentials: true,
});

const api_key = import.meta.env.VITE_API_KEY;

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${api_key}/api/reissue`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = res.data.accessToken;

        store.dispatch(SET_TOKEN({ token: newAccessToken }));

        return api(originalRequest);
      } catch (err) {
        store.dispatch(DELETE_TOKEN());
        alert("로그인 유효시간이 지났습니다.");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

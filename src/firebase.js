import firebase from "firebase/app";
import "firebase/messaging";
import { api } from "./services/api";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_SOTRAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGE_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_VITE_MEASUREMENT_ID,
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

export const requestForToken = async () => {
  try {
    const messaging = firebase.messaging();
    const token = await messaging.getToken({
      vapidKey: import.meta.env.VITE_VAPID_KEY,
    });
    return token;
  } catch (err) {}
};

export const sendTokenToServer = async (token, accessToken) => {
  try {
    await api.patch(
      "/users/fcm-token",
      { fcmToken: token },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken.token,
        },
      },
    );
  } catch (err) {
    console.error(err);
  }
};

export const onMessageListener = () => {
  const messaging = firebase.messaging();
  return new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });
};

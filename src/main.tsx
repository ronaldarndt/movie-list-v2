import "preact/debug";

import "@fontsource/manrope/400.css";
import "@unocss/reset/normalize.css";
import { render } from "preact";
import { FirebaseAppProvider } from "reactfire";
import "virtual:uno.css";
import { App } from "./app.tsx";
import "./global.css";

const firebaseConfig = {
  apiKey: "AIzaSyA2NGm-qq_tlaTPwQlLPDpvsst-R6tRjbY",
  authDomain: "movie-list-21f39.firebaseapp.com",
  projectId: "movie-list-21f39",
  storageBucket: "movie-list-21f39.appspot.com",
  messagingSenderId: "502905594406",
  appId: "1:502905594406:web:949b4f3f62bba5b3927ce7",
};

render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <App />
  </FirebaseAppProvider>,
  document.getElementById("app")!,
);

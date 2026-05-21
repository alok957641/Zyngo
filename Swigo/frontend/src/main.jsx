import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./index.css";
import App from "./App.jsx";
import {Provider} from  "react-redux";
import store from "./redux/store.js";

axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
);

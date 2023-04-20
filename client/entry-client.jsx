import { createRoot } from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";

const root = createRoot(document.getElementById("shopify-app"));
root.render(
    <Provider store={store}>
    <App />
    </Provider>
);

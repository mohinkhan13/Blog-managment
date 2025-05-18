import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store";
import AuthProvider from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom"; // BrowserRouter यहाँ जोड़ा

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        {" "}
        {/* BrowserRouter को यहाँ ऊपर ले गए */}
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

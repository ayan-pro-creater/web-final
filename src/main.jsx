import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/Router.jsx";
import AuthProvider from "./contexts/AuthProvider.jsx";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
    {/* ToastContainer enables global toast notifications */}
    <ToastContainer position="top-center" autoClose={3000} />
  </AuthProvider>
);

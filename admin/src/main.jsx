import React from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from "./App";
import "./index.css";
import { AdminAuthProvider } from "./context/AdminAuthContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AdminAuthProvider>
      <App />
    </AdminAuthProvider>
  </BrowserRouter>
);
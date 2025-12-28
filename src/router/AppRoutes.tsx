import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/Login/LoginPage";
import { PrivateRoute } from "../auth/PrivateRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <h1>Dashboard</h1>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

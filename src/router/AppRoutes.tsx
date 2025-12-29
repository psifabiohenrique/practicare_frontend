import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/Auth/LoginPage";
import { RegisterPage } from "../pages/Auth/RegisterPage";
import { PrivateRoute } from "../auth/PrivateRoute";
import { DashboardPage } from "../pages/Dashboard/DashboardPage";
import { MainLayout } from "../layouts/MainLayout";
import { UpdateUserPage } from "../pages/Dashboard/user/UpdateUserPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/user"
        element={
          <PrivateRoute>
            <MainLayout>
              <UpdateUserPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

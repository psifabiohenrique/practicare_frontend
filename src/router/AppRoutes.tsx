import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/Auth/LoginPage";
import { RegisterPage } from "../pages/Auth/RegisterPage";
import { PrivateRoute } from "../auth/PrivateRoute";
import { DashboardPage } from "../pages/Dashboard/DashboardPage";
import { MainLayout } from "../layouts/MainLayout";
import { UpdateUserPage } from "../pages/Dashboard/user/UpdateUserPage";
import { PatientListPage } from "../pages/Dashboard/patients/PatientListPage";
import { PatientCreatePage } from "../pages/Dashboard/patients/PatientCreatePage";
import { PatientDetailPage } from "../pages/Dashboard/patients/PatientDetailPage";
import { PatientUpdatePage } from "../pages/Dashboard/patients/PatientUpdatePage";
import { SessionSchedulePage } from "../pages/Dashboard/schedule/SessionSchedulePage";

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
      <Route
        path="/patient"
        element={
          <PrivateRoute>
            <MainLayout>
              <PatientListPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/patient/create"
        element={
          <PrivateRoute>
            <MainLayout>
              <PatientCreatePage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/patient/:id"
        element={
          <PrivateRoute>
            <MainLayout>
              <PatientDetailPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/patient/:id/edit"
        element={
          <PrivateRoute>
            <MainLayout>
              <PatientUpdatePage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/schedule"
        element={
          <PrivateRoute>
            <MainLayout>
              <SessionSchedulePage />
            </MainLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

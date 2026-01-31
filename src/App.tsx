import { Route, Routes } from "react-router";
import { LoginForm } from "./components/login.form";
import { RegisterForm } from "./components/register.form";
import AddKhanaPage from "./pages/add-khana";
import { AuthLayout } from "./layout/auth-layout";
import Me from "./pages/me";
import AdminLayout from "./layout/adminlayout";
import AdminUsers from "./components/admin/users";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/" element={<LoginForm />} />
      <Route
        path="/add-khana"
        element={
          <AuthLayout>
            <AddKhanaPage />
          </AuthLayout>
        }
      />
      <Route
        path="/me"
        element={
          <AuthLayout>
            <Me />
          </AuthLayout>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AuthLayout>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </AuthLayout>
        }
      />
    </Routes>
  );
}

export default App;

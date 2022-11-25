import { useContext } from "react";

import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";

import AuthContext, { AuthProvider } from "./context/auth";
import AdminPage from "./pages/AdminPage";
import ClinicSimpleRegister from "./pages/ClinicSimpleRegister";
import ExpertisePage from "./pages/ExpertisePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProcedurePage from "./pages/ProcedurePage";
import RegisterPage from "./pages/RegisterPage";
import UserPage from "./pages/UserPage";
import ClinicPage from "./pages/ClinicPage";

const AppRoutes = () => {
    const Private = ({ children }: { children: JSX.Element }) => {
        const { isAuthenticated, loading } = useContext(AuthContext);

        if (loading) {
            return <div>Loading...</div>;
        }

        if (isAuthenticated) {
            return children;
        } else {
            return <Navigate to="/login" />;
        }
    };

    const Admin = ({ children }: { children: JSX.Element }) => {
        const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);

        if (loading) {
            return <div>Loading...</div>;
        }

        if (isAuthenticated && isAdmin) {
            return children;
        } else {
            return <Navigate to="/" />;
        }
    };

    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="clinic/:id"
                        element={
                            <Private>
                                <ClinicPage />
                            </Private>
                        }
                    />
                    <Route
                        path="procedures"
                        element={
                            <Admin>
                                <ProcedurePage />
                            </Admin>
                        }
                    />
                    <Route
                        path="users"
                        element={
                            <Admin>
                                <UserPage />
                            </Admin>
                        }
                    />
                    <Route
                        path="procedures"
                        element={
                            <Admin>
                                <ProcedurePage />
                            </Admin>
                        }
                    />
                    <Route
                        path="expertises"
                        element={
                            <Admin>
                                <ExpertisePage />
                            </Admin>
                        }
                    />
                    <Route
                        path="users"
                        element={
                            <Admin>
                                <UserPage />
                            </Admin>
                        }
                    />
                    <Route path="clinicSettings" element={<AdminPage />} />
                    <Route path="profileSettings" element={<AdminPage />} />
                    <Route
                        path="consultationSettings"
                        element={<AdminPage />}
                    />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route
                        path="registerClinic"
                        element={
                            <Private>
                                <ClinicSimpleRegister />
                            </Private>
                        }
                    />
                    <Route
                        path="admin"
                        element={
                            <Admin>
                                <AdminPage />
                            </Admin>
                        }
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default AppRoutes;

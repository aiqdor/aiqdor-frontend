import { useContext } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth";
import { MainHeader } from "../../components/main-header";

const AdminPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <MainHeader />

            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                Admin Page
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/procedures")}
                >
                    {"Procedures"}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/users")}
                >
                    {"Usuários"}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/expertises")}
                >
                    {"Especializações"}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/clinics")}
                >
                    {"Clinicas"}
                </Button>
            </Box>
        </div>
    );
};

export default AdminPage;

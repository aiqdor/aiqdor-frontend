import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
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
                        <Box>
                            <Button sx={{m: 1}}
                                variant="contained"
                                color="primary"
                                onClick={() => navigate("/profile")}
                            >
                                {"Editar Perfil"}
                            </Button>

                            <Button sx={{m: 1}}
                                variant="contained"
                                color="primary"
                                onClick={() => navigate("/procedures")}
                            >
                                {"Procedures"}
                            </Button>
                        </Box>

                        <Box>
                            <Button sx={{m: 1}}
                                variant="contained"
                                color="primary"
                                onClick={() => navigate("/users")}
                            >
                                {"Usuários"}
                            </Button>

                            <Button sx={{m: 1}}
                                variant="contained"
                                color="primary"
                                onClick={() => navigate("/expertises")}
                            >
                                {"Especializações"}
                            </Button>

                            <Button sx={{m: 1}}
                                variant="contained"
                                color="primary"
                                onClick={() => navigate("/clinics")}
                            >
                                {"Clinicas"}
                            </Button>
                        </Box>

            </Box>
        </div>
    );
};

export default AdminPage;

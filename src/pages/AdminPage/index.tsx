import { Box, Button, Grid } from "@mui/material";
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
                <Grid container spacing={2} columns={16}>
                    <Grid item xs> 
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/profile")}
                        >
                            {"Editar Perfil"}
                        </Button>
                    </Grid>
                    <Grid item xs> 
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/procedures")}
                        >
                            {"Procedures"}
                        </Button>
                    </Grid>
                    <Grid item xs> 
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/users")}
                        >
                            {"Usuários"}
                        </Button>
                    </Grid>
                    <Grid item xs> 
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/expertises")}
                        >
                            {"Especializações"}
                        </Button>
                    </Grid>
                    <Grid item xs> 
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/clinics")}
                        >
                            {"Clinicas"}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default AdminPage;

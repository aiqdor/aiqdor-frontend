import { useContext } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth";
import { MainHeader } from "../../components/main-header";

const UserPage = () => {
    const { isOwner } = useContext(AuthContext);
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
                <Button sx={{m: 1}}
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/profile")}
                >
                    {"Editar Perfil"}
                </Button>

                {isOwner ? (
                    <Button sx={{m: 1}}
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/clinics")}
                    >
                        {"Clinicas"}
                    </Button>
                ) : null}
            </Box>
        </div>
    );
};

export default UserPage;

import React, { useContext } from "react";
import { Box, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth";
import { ClinicCard } from "../../components/clinic-card";
import { clinics } from '../../__mocks__/clinics';
import { MainHeader } from "../../components/main-header";

const HomePage = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleClick = () => {
        if (isAuthenticated) {
            logout();
        navigate("/");
        } else {
            navigate("/login");  
        }
    }

    return (  
        <Box
            sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <MainHeader />
            <Box sx={{ pt: 3 }}>
                <Grid
                    container
                    spacing={3}
                >
                    {clinics.map((clinic: any) => ( //create type clinic
                        <Grid
                            item
                            key={clinic.id}
                            // lg={4}
                            // md={6}
                            // xs={12}
                        >
                            <ClinicCard clinic={clinic} />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box>
                <Button variant="contained" color="primary" onClick={handleClick}>
                    {isAuthenticated ? "Logout" : "Login"}
                </Button>
            </Box>
        </Box>


    );
    }

    export default HomePage;
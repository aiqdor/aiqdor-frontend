import React, { useContext } from "react";
import { Box, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth";
import { ClinicCard } from "../../components/clinic-card";
import { HeaderP } from "../../components/headerp";
import { clinics } from '../../__mocks__/clinics';

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
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <HeaderP />

            <Box sx={{ pt: 3 }}>
                <Grid
                    container
                    spacing={3}
                >
                    {clinics.map((clinic: any) => ( //create type clinic
                    <Grid
                        item
                        key={clinic.id}
                        lg={4}
                        md={6}
                        xs={12}
                    >
                        <ClinicCard clinic={clinic} />
                    </Grid>
                    ))}
                </Grid>
            </Box>

            <Button variant="contained" color="primary" onClick={handleClick}>
                {isAuthenticated ? "Logout" : "Login"}
            </Button>
        </Box>


    );
    }

    export default HomePage;
import React from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    const goToLoginPage = () => {
        navigate("/login");
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <Button variant="contained" color="primary" onClick={goToLoginPage}>
                Make Login
            </Button>
        </Box>
    );
    }

    export default HomePage;
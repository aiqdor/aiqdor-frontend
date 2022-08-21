import React, { useContext } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth";

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
            <Button variant="contained" color="primary" onClick={ handleClick }>
                { isAuthenticated ? "Logout" : "Login" }
            </Button>
        </Box>
    );
    }

    export default HomePage;
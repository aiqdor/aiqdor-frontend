import React, { useContext } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth";

const AdminPage = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleClick = () => {
        logout();
        navigate("/");
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            Admin Page
            <Button variant="contained" color="primary" onClick={ handleClick }>
                { "Logout" }
            </Button>
        </Box>
    );
    }

    export default AdminPage;
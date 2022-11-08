import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth";
import { ClinicCard } from "../../components/clinic-card";
import { MainHeader } from "../../components/main-header";
import { SearchBar } from "../../components/search-bar";

import firebase from "firebase/app";
import { Clinic } from "../../types/Clinic";

const HomePage = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [clinics, setClinics] = useState<Clinic[]>([]);
    const getClinics = async () => {
        firebase
            .firestore()
            .collection("clinics")
            .onSnapshot((snapshot) => {
                const clinics: Clinic[] = [];
                snapshot.forEach((doc) => {
                    clinics.push({
                        id: doc.id,
                        name: doc.data().name,
                        address: doc.data().address,
                        phone: doc.data().phone,
                        email: doc.data().email,
                        website: doc.data().website,
                        description: doc.data().description,
                        mediaUrl: doc.data().mediaUrl,
                        category: doc.data().category,
                    });
                    setClinics(clinics);
                });
            });
    };

    useEffect(() => {
        getClinics();
    }, []);

    const handleClick = () => {
        if (isAuthenticated) {
            logout();
            navigate("/");
        } else {
            navigate("/login");
        }
    };

    return (
        <div>
            <MainHeader>
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClick}
                    >
                        {isAuthenticated ? "Logout" : "Login"}
                    </Button>
                </Box>
            </MainHeader>
            <SearchBar />
            <Box
                sx={{
                    "& .MuiTextField-root": { m: 1, width: "25ch" },
                }}
                margin="0 100px"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Box
                    sx={{ pt: 3 }}
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    {
                        <Grid container spacing={3}>
                            {clinics.map((clinic) => (
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
                    }
                </Box>
            </Box>
        </div>
    );
};

export default HomePage;

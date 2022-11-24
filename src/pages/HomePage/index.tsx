import { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { ClinicCard } from "../../components/clinic-card";
import { MainHeader } from "../../components/main-header";

import firebase from "firebase/app";
import { Clinic } from "../../types/Clinic";

const HomePage = () => {
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const getClinics = async (name?: string) => {
        firebase
            .firestore()
            .collection("clinics")
            .onSnapshot((snapshot) => {
                const clinics: Clinic[] = [];
                snapshot.forEach((doc) => {
                    clinics.push({
                        id: doc.id,
                        name: doc.data()?.name,
                        city: doc.data()?.city,
                        phone: doc.data().phone,
                        email: doc.data().email,
                        website: doc.data().website,
                        description: doc.data().description,
                        addressNumber: doc.data().addressNumber,
                        state: doc.data().state,
                        street: doc.data().street,
                        zipCode: doc.data().zipCode,
                        complement: doc.data().complement,
                        image: doc.data().image,
                        expertises: doc.data().expertises,
                        acceptsInsurance: false
                    });
                    setClinics(clinics);
                });
            });
    };

    useEffect(() => {
        getClinics();
    }, []);

    return (
        <Box>
            <MainHeader />
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
        </Box>
    );
};

export default HomePage;

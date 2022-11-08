import PropTypes from "prop-types";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    Typography,
    Icon,
    Button,
} from "@mui/material";
import React from "react";
import { Clinic } from "../types/Clinic";

const ClinicCard = ({ clinic, ...rest }: { clinic: Clinic }) => {
    const openDetails = (id: any) => {
        //todo open clinic details page
    };

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                maxWidth: 400,
            }}
            {...rest}
        >
            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        pb: 3,
                    }}
                >
                    <Avatar
                        alt="Product"
                        src={clinic.mediaUrl}
                        variant="rounded"
                    />
                </Box>
                <Typography
                    align="center"
                    color="textPrimary"
                    gutterBottom
                    variant="h5"
                >
                    {clinic.name}
                </Typography>
                <Typography align="center" color="textPrimary" variant="body1">
                    {clinic.category}
                </Typography>
            </CardContent>
            <Divider />
            <Box
                sx={{ p: 1 }}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                <Box display={"flex"} alignItems={"center"}>
                    <Icon color="action">schedule</Icon>
                    <Typography
                        color="textSecondary"
                        display="inline"
                        sx={{ pl: 1 }}
                        variant="body2"
                        alignItems={"center"}
                    >
                        Aberto
                    </Typography>
                </Box>
                <Button onClick={() => openDetails(clinic.id)}>Abrir</Button>
            </Box>
        </Card>
    );
};

ClinicCard.propTypes = {
    clinic: PropTypes.object.isRequired,
};

export { ClinicCard };

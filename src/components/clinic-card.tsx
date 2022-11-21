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
    Badge,
} from "@mui/material";
import React from "react";
import { Clinic } from "../types/Clinic";
import { CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ClinicCard = ({ clinic, ...rest }: { clinic: Clinic }) => {
    const navigate = useNavigate();

    const openDetails = (id: any) => {
        navigate(`/clinic/${id}`);
    };

    const clinicDetailsLink = `/clinic/${clinic.id}`;

    return (
        <CardActionArea
            href={clinicDetailsLink}
            sx={{
                maxWidth: 400,
            }}
        >
            <Card
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                }}
                {...rest}
            >
                <CardContent
                    sx={{
                        display: "flex",
                        pb: 3,
                    }}
                >
                    <Box
                        sx={{
                            marginRight: 5,
                        }}
                    >
                        <Badge
                            color="success"
                            variant="dot"
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                        >
                            <Avatar
                                sx={{ width: 80, height: 80 }}
                                alt="Foto"
                                src={clinic.mediaUrl}
                                variant="rounded"
                            />
                        </Badge>
                    </Box>
                    <Box
                        sx={{
                            textAlign: "left",
                            overflow: "hidden",
                        }}
                    >
                        <Typography
                            color="textPrimary"
                            gutterBottom
                            variant="h5"
                        >
                            {clinic.name}
                        </Typography>
                        <Typography color="textPrimary" variant="body1">
                            {clinic.category}
                        </Typography>
                        <Typography noWrap color="textPrimary" variant="body1">
                            {clinic?.address}
                        </Typography>
                    </Box>
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
                    <Button onClick={() => openDetails(clinic.id)}>
                        Abrir
                    </Button>
                </Box>
            </Card>
        </CardActionArea>
    );
};

ClinicCard.propTypes = {
    clinic: PropTypes.object.isRequired,
};

export { ClinicCard };

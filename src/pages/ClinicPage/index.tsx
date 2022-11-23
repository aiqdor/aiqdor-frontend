import {
    Avatar,
    Box,
    Divider,
    Typography,
    Icon,
    Button,
    Link,
    Tooltip,
} from "@mui/material";
import { Clinic } from "../../types/Clinic";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import { MainHeader } from "../../components/main-header";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import { useParams } from "react-router";
import { Container } from "@mui/material";
import { Procedure } from "../../types/Procedure";

const ClinicPage = () => {
    const [clinic, setClinic] = useState<Clinic>();
    const [procedures, setProcedures] = useState<Procedure[]>([]);

    const { id } = useParams();

    const getClinic = async () => {
        firebase
            .firestore()
            .doc(`clinics/${id}`)
            .onSnapshot((snapshot) => {
                const clinic = {
                    id: snapshot.id,
                    name: snapshot?.data()?.name,
                    address: snapshot?.data()?.address,
                    phone: snapshot?.data()?.phone,
                    email: snapshot?.da ta()?.email,
                    website: snapshot?.data()?.website,
                    description: snapshot?.data()?.description,
                    image: snapshot?.data()?.image,
                    category: snapshot?.data()?.category,
                    location: snapshot?.data()?.location,
                    acceptsInsurance: snapshot?.data()?.acceptsInsurance,
                };
                setClinic(clinic);
            });
    };

    const getProcedures = async () => {
        firebase
            .firestore()
            .collection("procedures")
            .where("clinicId", "==", id)
            .onSnapshot((snapshot) => {
                const procedures: Procedure[] = [];
                snapshot.forEach((doc) => {
                    procedures.push({
                        id: doc?.id,
                        name: doc?.data()?.name,
                        description: doc?.data()?.description,
                        price: doc?.data()?.price,
                        duration: doc?.data()?.duration,
                    });
                    setProcedures(procedures);
                });
            });
    };

    useEffect(() => {
        getClinic();
        getProcedures();
    }, []);

    if (!!clinic) {
        return (
            <div>
                <MainHeader />
                <Container
                    sx={{
                        marginTop: 10,
                    }}
                    maxWidth="sm"
                >
                    <Box
                        sx={{
                            border: 1,
                            borderRadius: 1,
                            borderColor: "divider",
                            p: 1,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                            }}
                        >
                            <Box
                                sx={{
                                    marginRight: 5,
                                }}
                            >
                                <Avatar
                                    alt="Foto clínica"
                                    src={clinic.image}
                                    variant="square"
                                    sx={{ width: 130, height: 130 }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="h3">
                                    {clinic.name}
                                </Typography>
                                <Typography>{clinic.description}</Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ marginTop: 2 }}>Detalhes</Divider>
                        <Box>
                            {clinic.address ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography>
                                        Endereço: {clinic.address}
                                    </Typography>
                                    <Link
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURI(
                                            clinic.address
                                        )}`}
                                        target={"_blank"}
                                    >
                                        <Tooltip title="Abrir no mapa">
                                            <Icon>open_in_new</Icon>
                                        </Tooltip>
                                    </Link>
                                </Box>
                            ) : null}
                            <Typography
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                Aceita Unimed:{" "}
                                {clinic.acceptsInsurance ? (
                                    <Icon fontSize="small" color="success">
                                        check_circle
                                    </Icon>
                                ) : (
                                    <Icon fontSize="small" color="error">
                                        cancel
                                    </Icon>
                                )}
                            </Typography>
                        </Box>
                        {clinic.phone || clinic.website || clinic.email ? (
                            <Box>
                                <Divider sx={{ marginTop: 2 }}>Contato</Divider>
                                <Box>
                                    {clinic.phone ? (
                                        <Typography
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            Telefone: {clinic.phone}
                                            <Link
                                                target={"_blank"}
                                                href={`https://wa.me/55${clinic.phone
                                                    .replace("(", "")
                                                    .replace(")", "")
                                                    .replace(
                                                        " ",
                                                        ""
                                                    )}?text=Olá, vi sua clínica pelo Aiqdor e gostaria de agenda uma consulta.`}
                                            >
                                                <WhatsAppIcon
                                                    color="success"
                                                    sx={{ display: "flex" }}
                                                />
                                            </Link>
                                        </Typography>
                                    ) : null}
                                </Box>
                                <Box>
                                    {clinic.email ? (
                                        <Typography>
                                            E-mail: {clinic.email}
                                        </Typography>
                                    ) : null}
                                </Box>
                                <Box>
                                    {clinic.website ? (
                                        <Typography>
                                            Site: {clinic.website}
                                        </Typography>
                                    ) : null}
                                </Box>
                            </Box>
                        ) : null}
                        <Box>
                            <Divider sx={{ marginTop: 2 }}>
                                Procedimentos
                            </Divider>
                            {procedures.map((procedure) => (
                                <Box
                                    sx={{
                                        border: 1,
                                        borderColor: "lightgrey",
                                        borderRadius: 2,
                                        p: 2,
                                        m: 1,
                                        display: "flex",
                                    }}
                                >
                                    <Box
                                        key={procedure.id}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "100%",
                                        }}
                                    >
                                        <Box>
                                            <Box>
                                                <Typography>
                                                    {procedure.name}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography>
                                                    Preço: {procedure.price}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography>
                                                    Descrição:{" "}
                                                    {procedure.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Link>
                                            <Button>Agendar</Button>
                                        </Link>
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        <Button fullWidth variant="contained">
                            Marcar horário
                        </Button>
                    </Box>
                </Container>
            </div>
        );
    } else {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                Carregando...
            </Box>
        );
    }
};

export default ClinicPage;

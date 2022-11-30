import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/app";
import {
    Box,
    Button,
    Modal,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { MainHeader } from "../../components/main-header";
import { Clinic } from "../../types/Clinic";
import AuthContext from "../../context/auth";
import { Procedure } from "../../types/Procedure";

const UserClinicsPage = () => {
    const navigate = useNavigate();
    const { isAdmin } = useContext(AuthContext);
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [procedures, setProcedures] = useState<Procedure[]>([]);
    const [proceduresClinic, setProceduresClinic] = useState<Procedure[]>([]);
    const [open, setOpen] = useState(false);
    const [idEdit, setIdEdit] = useState("");

    const openProcedures = (id: string) => {
        setIdEdit(id);
        getProcedures(id);
        setOpen(true);
    };

    const handleOpen = (id?: string) => {
        if (id) {
            navigate(`/registerClinic/${id}`);
        } else {
            navigate(`/registerClinic`);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setIdEdit("");
    };

    const styleModal = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };

    const deleteClinic = (id: string) => {
        firebase.firestore().collection("clinics").doc(id).delete();
    };

    const getProcedures = async (id: string) => {
        const procedures = await firebase.firestore().collection("procedures").get();
        const proceduresList: Procedure[] = [];
        procedures.forEach((procedure) => {
            proceduresList.push({
                id: procedure.id,
                name: procedure.data().name,
                description: procedure.data().description,
                price: procedure.data().price,
            });
        });
        setProcedures(proceduresList);

        await firebase
            .firestore()
            .collection("clinics")
            .doc(id)
            .collection("procedures")
            .onSnapshot((snapshot) => {
                const proceduresClinicList: Procedure[] = [];
                snapshot.forEach((procedure) => {
                    proceduresClinicList.push({
                        id: procedure.id,
                        name: procedure.data().name,
                        description: procedure.data().description,
                        price: procedure.data().price,
                    });
                });
                setProceduresClinic(proceduresClinicList);
            });
    };

    const getClinics = async () => {
        const user = firebase.auth().currentUser;
        if (isAdmin) {
            firebase
                .firestore()
                .collection("clinics")
                .onSnapshot((snapshot) => {
                    const clinics: Clinic[] = [];
                    snapshot.forEach((doc) => {
                        clinics.push({
                            id: doc.id,
                            name: doc.data().name,
                            description: doc.data().description,
                            acceptInsurance: doc.data().acceptInsurance,
                            idUser: doc.data().idUser,
                            addressNumber: doc.data().addressNumber,
                            city: doc.data().city,
                            complement: doc.data().complement,
                            image: doc.data().image,
                            phone: doc.data().phone,
                            state: doc.data().state,
                            street: doc.data().street,
                            website: doc.data().website,
                            zipCode: doc.data().zipCode,
                            email: doc.data().email,
                            expertises: doc.data().expertises,
                            showTimeSlots: doc.data().showTimeSlots,
                        });
                    });
                    setClinics(clinics);
                });
        } else if (user) {
            firebase
                .firestore()
                .collection("clinics")
                .where("idUser", "==", user.uid)
                .onSnapshot((snapshot) => {
                    const clinics: Clinic[] = [];
                    snapshot.forEach((doc) => {
                        clinics.push({
                            id: doc.id,
                            name: doc.data().name,
                            description: doc.data().description,
                            acceptInsurance: doc.data().acceptInsurance,
                            idUser: doc.data().idUser,
                            addressNumber: doc.data().addressNumber,
                            city: doc.data().city,
                            complement: doc.data().complement,
                            image: doc.data().image,
                            phone: doc.data().phone,
                            state: doc.data().state,
                            street: doc.data().street,
                            website: doc.data().website,
                            zipCode: doc.data().zipCode,
                            email: doc.data().email,
                            expertises: doc.data().expertises,
                            showTimeSlots: doc.data().showTimeSlots,
                        });
                    });
                    setClinics(clinics);
                });
        }
    };

    useEffect(() => {
        getClinics();
    }, []);

    return (
        <Box>
            <MainHeader>
                <Button variant="contained" onClick={() => navigate("/")}>
                    Voltar
                </Button>
            </MainHeader>

            <Button sx={{m: 1}} variant="contained" onClick={() => handleOpen()}>
                Adicionar Clinica
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleModal}>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nome</TableCell>
                                    <TableCell align="right">
                                        Descrição
                                    </TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {procedures.map((procedure) => (
                                    <TableRow
                                        key={procedure.id}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                { border: 0 },
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {procedure.name}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Switch
                                                checked={proceduresClinic.some(
                                                    (procedureClinic) =>
                                                        procedureClinic.id === procedure.id
                                                )}
                                                onChange={() => {
                                                    if (
                                                        proceduresClinic.some(
                                                            (procedureClinic) =>
                                                                procedureClinic.id === procedure.id
                                                        )
                                                    ) {
                                                        firebase
                                                            .firestore()
                                                            .collection("clinics")
                                                            .doc(idEdit)
                                                            .collection("procedures")
                                                            .doc(procedure.id)
                                                            .delete();
                                                    } else {
                                                        firebase
                                                            .firestore()
                                                            .collection("clinics")
                                                            .doc(idEdit)
                                                            .collection("procedures")
                                                            .doc(procedure.id)
                                                            .set({
                                                                name: procedure.name,
                                                                description: procedure.description,
                                                                price: procedure.price,
                                                            });
                                                    }
                                                }}
                                                inputProps={{
                                                    "aria-label":
                                                        "controlled",
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Modal>

            <Box
                sx={{ pt: 3, m: 2 }}
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                <h1>Clinicas</h1>
                {
                    <TableContainer component={Paper}>
                        <Table
                            sx={{ minWidth: 650 }}
                            size="small"
                            aria-label="a dense table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nome</TableCell>
                                    <TableCell align="right">
                                        Descrição
                                    </TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {clinics.map((clinic) => (
                                    <TableRow
                                        key={clinic.id}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                { border: 0 },
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {clinic.name}
                                        </TableCell>
                                        <TableCell align="right">
                                            {clinic.description}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                size="small"
                                                color="primary"
                                                onClick={() =>
                                                    openProcedures(clinic.id)
                                                }
                                            >
                                                Procedimentos
                                            </Button>
                                            <Button
                                                size="small"
                                                color="primary"
                                                onClick={() =>
                                                    handleOpen(clinic.id)
                                                }
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                size="small"
                                                color="primary"
                                                onClick={() =>
                                                    deleteClinic(clinic.id)
                                                }
                                            >
                                                Deletar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
            </Box>
        </Box>
    );
};

export default UserClinicsPage;

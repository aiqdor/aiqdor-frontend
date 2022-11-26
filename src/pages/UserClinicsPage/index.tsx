import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/app";
import {
    Box,
    Button,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { MainHeader } from "../../components/main-header";
import { Clinic } from "../../types/Clinic";
import AuthContext from "../../context/auth";

const UserClinicsPage = () => {
    const navigate = useNavigate();
    const { isAdmin } = useContext(AuthContext);
    const [clinics, setClinics] = useState<Clinic[]>([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [acceptInsurance, setAcceptInsurance] = useState(false);
    const [addressNumber, setAddressNumber] = useState("");
    const [city, setCity] = useState("");
    const [complement, setComplement] = useState("");
    const [image, setImage] = useState("");
    const [phone, setPhone] = useState("");
    const [state, setState] = useState("");
    const [street, setStreet] = useState("");
    const [website, setWebsite] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [email, setEmail] = useState("");
    const [expertise, setExpertise] = useState("");

    const [open, setOpen] = useState(false);
    const [idEdit, setIdEdit] = useState("");

    const handleOpen = async (id?: string) => {
        if (id) {
            const clinic = clinics.find((p) => p.id === id);
            if (clinic) {
                setName(clinic.name);
                setDescription(clinic.description);
                setIdEdit(id);
            }
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setName("");
        setDescription("");
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

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (idEdit !== "") {
            await firebase
                .firestore()
                .collection("clinics")
                .doc(idEdit)
                .update({
                    name,
                    description,
                });
        } else {
            await firebase.firestore().collection("clinics").add({
                name,
                description,
            });
        }

        handleClose();
    };

    const deleteClinic = (id: string) => {
        firebase.firestore().collection("clinics").doc(id).delete();
    };

    const getClinics = async () => {
        const user = firebase.auth().currentUser;
        if (isAdmin) {
            const clinics = await firebase
                .firestore()
                .collection("clinics")
                .get();
            setClinics(
                clinics.docs.map((doc) => ({
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
                }))
            );
        } else if (user) {
            const clinics = await firebase
                .firestore()
                .collection("clinics")
                .where("userId", "==", user.uid)
                .get();
            setClinics(
                clinics.docs.map((doc) => ({
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
                }))
            );
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

            <Button variant="contained" onClick={() => handleOpen()}>
                Adicionar Clinica
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleModal}>
                    <Box
                        component="form"
                        sx={{
                            "& .MuiTextField-root": { m: 1, width: "25ch" },
                        }}
                        autoComplete="off"
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        onSubmit={handleSubmit}
                    >
                        <Typography variant="h4">Clinica</Typography>
                        <TextField
                            required
                            id="outlined-required"
                            label="Nome"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Descrição"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <Button variant="contained" type="submit">
                            Salvar
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <h1>Clinicas</h1>
            <Box
                sx={{ pt: 3 }}
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
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

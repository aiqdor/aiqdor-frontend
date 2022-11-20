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
import { Expertise } from "../../types/Expertise";

const ExpertisePage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState(0);
    const [price, setPrice] = useState("");
    const [open, setOpen] = useState(false);
    const [idEdit, setIdEdit] = useState("");

    const handleOpen = async (id?: string) => {
        if (id) {
            const expertise = expertises.find((p) => p.id === id);
            if (expertise) {
                setName(expertise.name);
                setDescription(expertise.description);
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
    }

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
            await firebase.firestore().collection("expertises").doc(idEdit).update({
                name,
                description,
            });
        } else {
            await firebase.firestore().collection("expertises").add({
                name,
                description,
            });
        }

        handleClose();
    };

    const deleteExpertise = (id: string) => {
        firebase.firestore().collection("expertises").doc(id).delete();
    };

    const [expertises, setExpertises] = useState<Expertise[]>([]);

    const getExpertises = async () => {
        firebase
            .firestore()
            .collection("expertises")
            .onSnapshot((snapshot) => {
                const expertises: Expertise[] = [];
                snapshot.forEach((doc) => {
                    expertises.push({
                        id: doc.id,
                        name: doc.data().name,
                        description: doc.data().description,
                    });
                    setExpertises(expertises);
                });
            });
    };

    useEffect(() => {
        getExpertises();
    }, []);

    return (
        <Box>
            <MainHeader>
                <Button variant="contained" onClick={() => navigate("/")}>
                    Voltar
                </Button>
            </MainHeader>

            <Button variant="contained" onClick={() => handleOpen()}>
                Adicionar Especialização
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
                        <Typography variant="h4">Especialização</Typography>
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

            <h1>Especializações</h1>
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
                                {expertises.map((expertise) => (
                                    <TableRow
                                        key={expertise.id}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                { border: 0 },
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {expertise.name}
                                        </TableCell>
                                        <TableCell align="right">
                                            {expertise.description}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                size="small"
                                                color="primary"
                                                onClick={() =>
                                                    handleOpen(expertise.id)
                                                }
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                size="small"
                                                color="primary"
                                                onClick={() =>
                                                    deleteExpertise(
                                                        expertise.id
                                                    )
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

export default ExpertisePage;

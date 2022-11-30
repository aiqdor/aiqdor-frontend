import { useState, useEffect } from "react";
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
import { Procedure } from "../../types/Procedure";

const ProcedurePage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [open, setOpen] = useState(false);
    const [idEdit, setIdEdit] = useState("");

    const handleOpen = async (id?: string) => {
        if (id) {
            const procedure = procedures.find((p) => p.id === id);
            if (procedure) {
                setName(procedure.name);
                setDescription(procedure.description);
                setPrice(procedure.price);
                setIdEdit(id);
            }
        } 
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setName("");
        setDescription("");
        setPrice("");
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
            await firebase.firestore().collection("procedures").doc(idEdit).update({
                name,
                description,
                price,
            });
        } else {
            await firebase.firestore().collection("procedures").add({
                name,
                description,
                price,
            });
        }

        handleClose();
    };

    const deleteProcedure = (id: string) => {
        firebase.firestore().collection("procedures").doc(id).delete();
    };

    const [procedures, setProcedures] = useState<Procedure[]>([]);

    const getProcedures = async () => {
        firebase
            .firestore()
            .collection("procedures")
            .onSnapshot((snapshot) => {
                const procedures: Procedure[] = [];
                snapshot.forEach((doc) => {
                    procedures.push({
                        id: doc.id,
                        name: doc.data().name,
                        description: doc.data().description,
                        price: doc.data().price,
                    });
                    setProcedures(procedures);
                });
            });
    };

    useEffect(() => {
        getProcedures();
    }, []);

    return (
        <Box>
            <MainHeader>
                <Button variant="contained" onClick={() => navigate("/")}>
                    Voltar
                </Button>
            </MainHeader>

            <Button variant="contained" onClick={() => handleOpen()}>
                Adicionar Procedimento
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
                        <Typography variant="h4">Procedimento</Typography>
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
                        <TextField
                            required
                            id="outlined-required"
                            label="Preço"
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <Button variant="contained" type="submit">
                            Salvar
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <h1>Procedimentos</h1>
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
                                    <TableCell align="right">
                                        Preço&nbsp;(R$)
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
                                            {procedure.description}
                                        </TableCell>
                                        <TableCell align="right">
                                            {procedure.price}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                size="small"
                                                color="primary"
                                                onClick={() =>
                                                    handleOpen(procedure.id)
                                                }
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                size="small"
                                                color="primary"
                                                onClick={() =>
                                                    deleteProcedure(
                                                        procedure.id
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

export default ProcedurePage;

import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
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

const ProcedurePage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState("");
    const [price, setPrice] = useState("");

    const [open, setOpen] = React.useState(false);
    const handleOpen = async (_id: string) => {
        console.log(_id);
        if (_id) {
            const procedure = procedures.find((p) => p.id === _id);
            if (procedure) {
                setName(procedure.name);
                setDescription(procedure.description);
                setDuration(procedure.duration);
                setPrice(procedure.price);
            }
        } else {
            setName("");
            setDescription("");
            setDuration("");
            setPrice("");
        }
        setOpen(true);
    };
    const handleClose = () => setOpen(false);
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
    const handleSubmit = (e: any) => {
        e.preventDefault();
        firebase.firestore().collection("procedures").add({
            id: uuid(),
            name,
            description,
            duration,
            price,
        });
        setOpen(false);
        getProcedures();
    };

    const deleteProcedure = (id: string) => {
        firebase.firestore().collection("procedures").doc(id).delete();
    };

    const [procedures, setProcedures] = React.useState<
        firebase.firestore.DocumentData[]
    >([]);

    const getProcedures = async () => {
        const procedures = await firebase
            .firestore()
            .collection("procedures")
            .get();

        const data = procedures.docs.map((procedure) => procedure.data());
        setProcedures(data);
    };

    //use useEffect to get the procedures
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

            <Button variant="contained" onClick={handleOpen}>
                Adicionar novo procedimento
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
                        <TextField
                            required
                            id="outlined-required"
                            label="Duração (minutos)"
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
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
                                    <TableCell align="right">
                                        Duração&nbsp;(min)
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
                                            {procedure.duration}
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
function uuidv4(): any {
    throw new Error("Function not implemented.");
}

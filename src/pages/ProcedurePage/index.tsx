import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/app";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { MainHeader } from "../../components/main-header";

const ProcedurePage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
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
            name,
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
        <div>
            <MainHeader>
                <Button variant="contained" onClick={() => navigate("/")}>
                    Back
                </Button>
            </MainHeader>

            <Button variant="contained" onClick={handleOpen}>Adicionar novo procedimento</Button>
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
                            label="Primeiro Nome"
                            type="text"
                            autoComplete="given-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Button variant="contained" type="submit">
                            Cadastrar
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* list of procedures */}
            <h1>Procedures</h1>
            <div>
                {procedures.map((procedure) => (
                    <div>
                        <h2>{procedure.name}</h2>
                        <p>{procedure.description}</p>
                        <p>{procedure.price}</p>
                        <p>{procedure.duration}</p>
                        <Button variant="contained" onClick={handleOpen}>
                            Editar
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => deleteProcedure(procedure.uid)}
                        >
                            Deletar
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProcedurePage;

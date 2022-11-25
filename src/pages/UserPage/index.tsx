import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/app";
import {
    Box,
    Button,
    Modal,
    Paper,
    Stack,
    Switch,
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
import { User } from "../../types/User";

const UserPage = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [idEdit, setIdEdit] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [admin, setAdmin] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleOpen = async (id?: string) => {
        if (id) {
            const user = users.find((p) => p.id === id);
            if (user) {
                setIdEdit(id);
                setFirstName(user.firstName);
                setLastName(user.lastName);
                setEmail(user.email);
                setAdmin(user.admin);
                setIsOwner(user.isOwner);
                setPhoneNumber(user.phoneNumber);
            }
        }
        setOpen(true);
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

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (idEdit !== "") {
            await firebase.firestore().collection("users").doc(idEdit).update({
                firstName,
                lastName,
                email,
                admin,
                isOwner,
                phoneNumber,
            });
        } else {
            await firebase.firestore().collection("users").add({
                firstName,
                lastName,
                email,
                admin,
                isOwner,
                phoneNumber,
            });
        }

        handleClose();
    };

    const deleteUser = (id: string) => {
        firebase.firestore().collection("users").doc(id).delete();
    };

    const [users, setUsers] = useState<User[]>([]);

    const getUsers = async () => {
        firebase
            .firestore()
            .collection("users")
            .onSnapshot((snapshot) => {
                const users: User[] = [];
                snapshot.forEach((doc) => {
                    users.push({
                        id: doc.id,
                        firstName: doc.data().firstName,
                        lastName: doc.data().lastName,
                        email: doc.data().email,
                        admin: doc.data().admin,
                        isOwner: doc.data().isOwner,
                        phoneNumber: doc.data().phoneNumber,
                        createdAt: doc.data().createdAt,
                    });
                    setUsers(users);
                });
            });
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <Box>
            <MainHeader>
                <Button variant="contained" onClick={() => navigate("/")}>
                    Voltar
                </Button>
            </MainHeader>

            <Button variant="contained" onClick={() => handleOpen()}>
                Adicionar Usuário
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
                        <Typography variant="h4">Usuário</Typography>
                        <TextField
                            required
                            id="outlined-required"
                            label="Primeiro nome"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Último nome"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Telefone"
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        Dono de clínica?
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography>Não</Typography>
                            <Switch
                                checked={isOwner}
                                onChange={() => setIsOwner(!isOwner)}
                                inputProps={{ "aria-label": "controlled" }}
                            />
                            <Typography>Sim</Typography>
                        </Stack>
                        Administrador?
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography>Não</Typography>
                            <Switch
                                checked={admin}
                                onChange={() => setAdmin(!admin)}
                                inputProps={{ "aria-label": "controlled" }}
                            />
                            <Typography>Sim</Typography>
                        </Stack>
                        <Button variant="contained" type="submit">
                            Salvar
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <h1>Usuários</h1>
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
                                    <TableCell align="right">Email</TableCell>
                                    <TableCell align="right">
                                        Telefone
                                    </TableCell>
                                    <TableCell align="right">Admin</TableCell>
                                    <TableCell align="right">
                                        Dono de Clínica
                                    </TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                { border: 0 },
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {user.firstName} {user.lastName}
                                        </TableCell>
                                        <TableCell align="right">
                                            {user.email}
                                        </TableCell>
                                        <TableCell align="right">
                                            {user.phoneNumber}
                                        </TableCell>
                                        <TableCell align="right">
                                            {user.admin ? "Sim" : "Não"}
                                        </TableCell>
                                        <TableCell align="right">
                                            {user.isOwner ? "Sim" : "Não"}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                size="small"
                                                color="primary"
                                                onClick={() =>
                                                    handleOpen(user.id)
                                                }
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                size="small"
                                                color="primary"
                                                onClick={() =>
                                                    deleteUser(user.id)
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

export default UserPage;

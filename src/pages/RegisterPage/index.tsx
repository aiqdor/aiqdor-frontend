import React, { useState, useContext } from "react";

import AuthContext from "../../context/auth";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputMask from "react-input-mask";
import {
    Button,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Switch,
    Typography,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { Navigate, useNavigate } from "react-router-dom";
import { PhoneInput } from "../../components/phone-input";

const RegisterPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, login, createAccount } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isOwner, setIsOwner] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await createAccount(
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                phoneNumber,
                isOwner
            );

            if (isOwner) {
                navigate("/registerClinic");
            } else {
                navigate("/");
            }
        } catch (err) {
            console.log(err);
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setPhoneNumber("");
            setFirstName("");
            setlastName("");
            setIsOwner(false);
        }
    };

    return (
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
            minHeight="100vh"
            onSubmit={handleSubmit}
        >
            <Box>
                <TextField
                    required
                    id="outlined-required"
                    label="Primeiro Nome"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <TextField
                    required
                    id="outlined-required"
                    label="Sobrenome"
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setlastName(e.target.value)}
                />
            </Box>
            <Box>
                <TextField
                    required
                    id="outlined-required"
                    label="Email"
                    type="email"
                    value={email}
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <PhoneInput 
                    value={phoneNumber}
                    onChange={(e: any) => setPhoneNumber(e.target.value)}
                />
            </Box>
            <Box>
                <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                        Senha
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={password.length > 0 && password.length < 6}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Senha"
                    />
                </FormControl>
                <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                        Confirme a Senha
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={
                            password.length > 0 && confirmPassword !== password
                        }
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Confirme a Senha"
                    />
                </FormControl>
            </Box>
            Você é dono de clínica?
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Não</Typography>
                <Switch
                    checked={isOwner}
                    onChange={() => setIsOwner(!isOwner)}
                    inputProps={{ "aria-label": "controlled" }}
                />
                <Typography>Sim</Typography>
            </Stack>
            <Button variant="contained" type="submit">
                Cadastrar
            </Button>
            <Button variant="text" onClick={() => navigate(-1)}>
                Voltar
            </Button>
        </Box>
    );
};

export default RegisterPage;

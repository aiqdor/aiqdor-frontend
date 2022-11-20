import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../../context/auth";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";

const LoginPage = () => {
    const { isAuthenticated, login } = useContext(AuthContext);
    const navigate = useNavigate();

    if (isAuthenticated) {
        navigate("/");
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
      };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };  

    const handleSubmit = (e: any) => {
        e.preventDefault();
        login(email, password);
    };
    
    const handleClick = () => {
        navigate("/register");
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
            onSubmit={ handleSubmit }
        >
            <TextField
                required
                autoComplete="email"
                id="outlined-required"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                            label="Confirme a Senha"
                />
            </FormControl>

            <Button variant="contained" type="submit">
                Entrar
            </Button>

            <Button variant="text" color="primary" onClick={ handleClick }>
                Cadastre-se
            </Button>
        </Box>
    );
};

export default LoginPage;

import React, { useState, useContext, useEffect } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import firebase from "firebase";
import { Expertise } from "../../types/Expertise";
import { State } from "../../types/State";
import { City } from "../../types/City";

const ClinicSimpleRegisterPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [addressStreet, setAddressStreet] = useState("");
    const [website, setWebsite] = useState("");
    const [description, setDescription] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [expertises, setExpertises] = useState<Expertise[]>([]);
    const [selectedExpertise, setSelectedExpertise] = useState<Expertise>();
    const [states, setStates] = useState<State[]>([]);
    const [selectedState, setSelectedState] = useState<State>();
    const [cities, setCities] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState<City>();
    const [cep, setCep] = useState("");
    const [addressNumber, setAddressNumber] = useState("");
    const [addressComplement, setAddressComplement] = useState("");

    const handleSubmit = async(e: any) => {
        e.preventDefault();

        await firebase.firestore().collection("clinics").add({
            idUser: firebase.auth().currentUser?.uid,
            name,
            website,
            description,
            phoneNumber,
            idExpertise: selectedExpertise?.id,
            idState: selectedState?.id,
            idCity: selectedCity?.id,
        });

        // await firebase.firestore().collection("addresses").add({
        //     idUser: firebase.auth().currentUser?.uid,
        //     street: addressStreet,
        //     number: addressNumber,
        //     complement: addressComplement,
        //     cep,
        //     idState: selectedState?.id,
        //     idCity: selectedCity?.id,
        // });

        navigate("/");
    };

    const loadExpertises = async () => {
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

    const loadStates = async () => {
        const response = await fetch(
            "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
        );
        const data = await response.json();
        const states: State[] = [];
        data.forEach((state: any) => {
            states.push({
                id: state.id,
                name: state.nome,
                uf: state.sigla,
            });
        });
        setStates(states);
    };

    const loadCities = async (ufState: number) => {
        const response = await fetch(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufState}/municipios`
        );
        const data = await response.json();
        const cities: City[] = [];
        data.forEach((city: any) => {
            cities.push({
                id: city.id,
                name: city.nome,
            });
        });
        setCities(cities);
    };

    useEffect(() => {
        loadExpertises();
        loadStates();
    }, []);

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
            {/* <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                
                type="file"
            />
            <label htmlFor="raised-button-file">
                <Button variant="contained" component="span">
                    Upload
                </Button>
            </label>        */}

            <TextField
                required
                sx={{ m: 1, width: "100ch" }}
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

            <Box>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                        Especialização
                    </InputLabel>
                    <Select
                        label="Especialização"
                        value={selectedExpertise}
                        sx={{ width: 300 }}
                    >
                        {expertises.map((expertise) => (
                            <MenuItem
                                key={expertise.id}
                                value={expertise.id}
                                onClick={() => setSelectedExpertise(expertise)}
                            >
                                {expertise.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">
                        Estado
                    </InputLabel>
                    <Select
                        label="Estado"
                        value={selectedState}
                        onChange={(e) => loadCities(e.target.value)}
                    >
                        {states.map((state) => (
                            <MenuItem
                                key={state.uf}
                                value={state.uf}
                                onClick={() => setSelectedState(state)}
                            >
                                {state.uf}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">
                        Cidade
                    </InputLabel>
                    <Select label="Cidade" value={selectedCity}>
                        {cities.map((city) => (
                            <MenuItem
                                key={city.id}
                                value={city.id}
                                onClick={() => setSelectedCity(city)}
                            >
                                {city.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box>
                <TextField
                    required
                    id="outlined-required"
                    label="CEP"
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                />

                <TextField
                    required
                    id="outlined-required"
                    label="Rua"
                    type="text"
                    value={addressStreet}
                    onChange={(e) => setAddressStreet(e.target.value)}
                />
            </Box>

            <Box>
                <TextField
                    required
                    id="outlined-required"
                    label="Número"
                    type="text"
                    value={addressNumber}
                    onChange={(e) => setAddressNumber(e.target.value)}
                />

                <TextField
                    id="outlined"
                    label="Complemento"
                    type="text"
                    value={addressComplement}
                    onChange={(e) => setAddressComplement(e.target.value)}
                />
            </Box>

            <Box>
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
            </Box>

            <Box>
                <TextField
                    id="outlined"
                    label="Website"
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                />
            </Box>

            <Button variant="contained" type="submit">
                Cadastrar
            </Button>

            <Button variant="text" onClick={() => navigate(-1)}>
                Voltar
            </Button>
        </Box>
    );
};

export default ClinicSimpleRegisterPage;

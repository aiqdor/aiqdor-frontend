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
    const [selectedExpertises, setSelectedExpertises] = useState<string[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [selectedState, setSelectedState] = useState<State>();
    const [cities, setCities] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState<City>();
    const [cep, setCep] = useState("");
    const [addressNumber, setAddressNumber] = useState("");
    const [addressComplement, setAddressComplement] = useState("");
    const [image, setImage] = useState("");
    const [acceptInsurance, setAcceptInsurance] = useState(false);

    const storage = firebase.storage().ref();

    const uploadImage = async (e: any) => {
        const file = e.target.files[0];

        console.log(file);

        const response = await storage.child(file.name).put(file);

        setImage(await response.ref.getDownloadURL());
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        await firebase.firestore().collection("clinics").add({
            idUser: firebase.auth().currentUser?.uid,
            name,
            website,
            description,
            phone: phoneNumber,
            expertises: selectedExpertises?.name,
            idState: selectedState?.name,
            idCity: selectedCity?.name,
            image,
            acceptInsurance,
        });

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

    const loadCities = async (stateUF: string) => {
        const response = await fetch(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateUF}/municipios`
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

    const handleBack = () => {
        navigate("/home");
    };

    const handleExpertiseSelect = (expertise: Expertise) => {
        console.log(selectedExpertises, expertise)
        setSelectedExpertises([...selectedExpertises, expertise.name]);
    } 

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
            }}
        >
            <Box
                component="form"
                sx={{
                    m: "0 auto",
                    width: "70%",
                    border: "1px solid #000",
                    borderRadius: "20px",
                    boxSizing: "border-box",
                    textAlign: "center",
                    gap: 2,
                }}
                autoComplete="off"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                onSubmit={handleSubmit}
            >
                <Box className="form-separation">
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
                </Box>

                <Box
                    sx={{
                        width: "50%",
                    }}
                >
                    <FormControl
                        sx={{
                            width: "100%",
                        }}
                    >
                        <InputLabel id="demo-simple-select-label">
                            Especialização
                        </InputLabel>
                        <Select
                            label="Especialização"
                            value={selectedExpertises}
                            multiple
                        >
                            {expertises.map((expertise) => (
                                <MenuItem
                                    key={expertise.id}
                                    value={expertise.id}
                                    onClick={() =>
                                        handleExpertiseSelect(expertise)
                                    }
                                >
                                    {expertise.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box className="form-separation">
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="demo-simple-select-label">
                            Estado
                        </InputLabel>
                        <Select
                            label="Estado"
                            value={selectedState}
                            MenuProps={{
                                PaperProps: { sx: { maxHeight: 300 } },
                            }}
                        >
                            {states.map((state) => (
                                <MenuItem
                                    key={state.uf}
                                    value={state.uf}
                                    onClick={() => {
                                        setSelectedState(state);
                                        loadCities(state.uf);
                                    }}
                                >
                                    {state.uf}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="demo-simple-select-label">
                            Cidade
                        </InputLabel>
                        <Select
                            autoWidth
                            label="Cidade"
                            value={selectedCity}
                            MenuProps={{
                                PaperProps: { sx: { maxHeight: 300 } },
                            }}
                        >
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

                <Box className="form-separation">
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

                <Box className="form-separation">
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

                <Box className="form-separation">
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

                <Box className="form-separation">
                    <TextField
                        id="outlined"
                        label="Website"
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                    />
                    <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "50%",
                    }}>
                        <Button variant="contained" component="label">
                            Upload Imagem
                            <input
                                accept="image/*"
                                style={{ display: "none" }}
                                id="raised-button-file"
                                type="file"
                                onInput={(e) => uploadImage(e)}
                            />
                        </Button>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 4,
                    }}
                >
                    <Button variant="text" onClick={handleBack}>
                        Voltar
                    </Button>

                    <Button variant="contained" type="submit">
                        Cadastrar
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ClinicSimpleRegisterPage;

import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
    Button,
    FormControl,
    FormControlLabel,
    Icon,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Switch,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import firebase from "firebase";
import { Expertise } from "../../types/Expertise";
import { State } from "../../types/State";
import { City } from "../../types/City";

const ClinicSimpleRegister = () => {
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

    const [imageUploaded, setImageUploaded] = useState(false);
    const [imageUploadError, setImageUploadError] = useState(false);

    const storage = firebase.storage().ref();

    const uploadImage = async (e: any) => {
        const file = e.target.files[0];

        console.log(file);

        try {
            const response = await storage.child(file.name).put(file);

            setImage(await response.ref.getDownloadURL());

            setImageUploaded(true);
        } catch (err) {
            setImageUploadError(true);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        await firebase.firestore().collection("clinics").add({
            idUser: firebase.auth().currentUser?.uid,
            name,
            website,
            description,
            street: addressStreet,
            addressNumber,
            complement: addressComplement,
            phone: phoneNumber,
            expertises: selectedExpertises,
            state: selectedState?.name,
            city: selectedCity?.name,
            email,
            zipCode: cep,
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

    const handleAcceptInsurance = (e: any) => {
        setAcceptInsurance(e.target.checked);
    }

    const handleExpertiseSelect = (event: SelectChangeEvent) => {
        const {
            target: { value },
        } = event;
        console.log(value, event);
        setSelectedExpertises(
            typeof value === "string" ? value.split(",") : value
        );
        console.log(selectedExpertises);
    };

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
                    textAlign: "center",
                    width: "100%",
                    gap: 2,
                    maxWidth: "1050px",
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
                        sx={{
                            width: "40%",
                        }}
                        required
                        id="outlined-required"
                        label="Nome"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <TextField
                        sx={{
                            width: "40%",
                        }}
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
                            // @ts-ignore
                            value={selectedExpertises}
                            multiple
                            onChange={handleExpertiseSelect}
                        >
                            {expertises.map((expertise) => (
                                <MenuItem
                                    key={expertise.id}
                                    value={expertise.name}
                                >
                                    {expertise.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box className="form-separation">
                    <FormControl
                        sx={{
                            width: "40%",
                        }}
                    >
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

                    <FormControl
                        sx={{
                            width: "40%",
                        }}
                    >
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
                        sx={{
                            width: "40%",
                        }}
                        required
                        id="outlined-required"
                        label="CEP"
                        type="text"
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                    />

                    <TextField
                        sx={{
                            width: "40%",
                        }}
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
                        sx={{
                            width: "40%",
                        }}
                        required
                        id="outlined-required"
                        label="Número"
                        type="text"
                        value={addressNumber}
                        onChange={(e) => setAddressNumber(e.target.value)}
                    />

                    <TextField
                        sx={{
                            width: "40%",
                        }}
                        id="outlined"
                        label="Complemento"
                        type="text"
                        value={addressComplement}
                        onChange={(e) => setAddressComplement(e.target.value)}
                    />
                </Box>

                <Box className="form-separation">
                    <TextField
                        sx={{
                            width: "40%",
                        }}
                        required
                        id="outlined-required"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        sx={{
                            width: "40%",
                        }}
                        required
                        id="outlined-required"
                        label="Telefone"
                        type="text"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </Box>

                <Box className="form-separation">
                    <TextField
                        sx={{
                            width: "40%",
                        }}
                        id="outlined"
                        label="Website"
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "40%",
                        }}
                    >
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
                        {imageUploaded ? (
                            <Icon color="success">check_circle</Icon>
                        ) : imageUploadError ? (
                            <Icon color="error">error</Icon>
                        ) : null}
                    </Box>
                </Box>
                    <FormControlLabel onChange={handleAcceptInsurance} control={<Switch/>} label="Aceita Unimded"/>

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

export default ClinicSimpleRegister;

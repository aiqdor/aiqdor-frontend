import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
    Avatar,
    Button,
    Icon,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import firebase from "firebase";
import { MainHeader } from "../../components/main-header";
import { PhoneInput } from "../../components/phone-input";

const ProfilePage = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");

    const [imageUploaded, setImageUploaded] = useState(false);
    const [imageUploadError, setImageUploadError] = useState(false);

    const storage = firebase.storage().ref();

    const uploadImage = async (e: any) => {
        const file = e.target.files[0];

        try {
            const response = await storage.child(file.name).put(file);

            setImage(await response.ref.getDownloadURL());

            firebase
                .firestore()
                .collection("users")
                .doc(userId)
                .update({
                    image: await response.ref.getDownloadURL(),
                });

            setImageUploaded(true);
        } catch (err) {
            setImageUploadError(true);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (userId) {
            await firebase.firestore().collection("users").doc(userId).update({
                firstName,
                lastName,
                email,
                image,
                phoneNumber,
                birthDate,
                height,
                weight,
            });
        }

        navigate("/");
    };

    const getUserInfo = async () => {
        const userId = await JSON.parse(localStorage.getItem("authUser") || "{}");

        const userInfo = await firebase
                .firestore()
                .collection("users")
                .doc(userId.uid)
                .get();

                const data = userInfo.data();

                setFirstName(data?.firstName);
                setlastName(data?.lastName);
                setEmail(data?.email);
                setImage(data?.image);
                setPhoneNumber(data?.phoneNumber);
                setBirthDate(data?.birthDate);
                setHeight(data?.height);
                setWeight(data?.weight);
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    const handleBack = () => {
        navigate("/");
    };

    return (
        <Box>
            <MainHeader />

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
                    <Avatar
                        sx={{ width: 80, height: 80 }}
                        alt="Foto"
                        src={image}
                        variant="rounded"
                    />

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

                    <Box className="form-separation">
                        <TextField
                            sx={{
                                width: "40%",
                            }}
                            required
                            id="outlined-required"
                            label="Nome"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />

                        <TextField
                            sx={{
                                width: "40%",
                            }}
                            required
                            id="outlined-required"
                            label="Sobrenome"
                            type="text"
                            value={lastName}
                            onChange={(e) => setlastName(e.target.value)}
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

                        <PhoneInput 
                            value={phoneNumber}
                            onChange={(e: any) => setPhoneNumber(e.target.value)}
                        />
                    </Box>

                    <Box className="form-separation">
                        <TextField
                            sx={{
                                width: "40%",
                            }}
                            required
                            id="outlined-required"
                            label="Data de nascimento"
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                        />
                    </Box>

                    <Box className="form-separation">
                        <TextField
                            sx={{
                                width: "40%",
                            }}
                            required
                            id="outlined-required"
                            label="Altura"
                            type="text"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                        />

                        <TextField
                            sx={{
                                width: "40%",
                            }}
                            required
                            id="outlined-required"
                            label="Peso"
                            type="text"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
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
                            Salvar
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ProfilePage;

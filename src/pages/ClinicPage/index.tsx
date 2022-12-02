// @ts-nocheck
import {
    Avatar,
    Box,
    Divider,
    Typography,
    Icon,
    Button,
    Link,
    Tooltip,
    Modal,
} from "@mui/material";
import { Clinic } from "../../types/Clinic";
import { useContext, useEffect, useState } from "react";
import firebase from "firebase/app";
import { MainHeader } from "../../components/main-header";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { AuthContext } from "../../context/auth";

import { eachDayOfInterval, startOfWeek, endOfWeek, format } from "date-fns";

import { useParams } from "react-router";
import { Procedure } from "../../types/Procedure";
import { Slot } from "../../types/Slot";
import ptBR from "date-fns/locale/pt-BR";
import moment from "moment";
import { toast } from "react-toastify";

const ClinicPage = () => {
    const [clinic, setClinic] = useState<Clinic>();
    const [procedures, setProcedures] = useState<Procedure[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedSlot, setSelectedSlot] = useState({});
    const [usedSlots, setUsedSlots] = useState<Slot[]>([]);

    const { id } = useParams();

    const { user } = useContext(AuthContext);

    const getClinic = async () => {
        firebase
            .firestore()
            .doc(`clinics/${id}`)
            .onSnapshot((snapshot) => {
                const clinic: Clinic = {
                    id: snapshot.id,
                    name: snapshot?.data()?.name,
                    state: snapshot?.data()?.state,
                    city: snapshot?.data()?.city,
                    street: snapshot?.data()?.street,
                    zipCode: snapshot?.data()?.zipCode,
                    addressNumber: snapshot?.data()?.addressNumber,
                    complement: snapshot?.data()?.complement,
                    phone: snapshot?.data()?.phone,
                    email: snapshot?.data()?.email,
                    website: snapshot?.data()?.website,
                    idUser: snapshot?.data()?.idUser,
                    description: snapshot?.data()?.description,
                    image: snapshot?.data()?.image,
                    expertises: snapshot?.data()?.expertises,
                    acceptInsurance: snapshot?.data()?.acceptInsurance,
                    showTimeSlots: snapshot?.data()?.showTimeSlots,
                };
                setClinic(clinic);
            });
    };

    const address = `${clinic?.state}, ${clinic?.city}, ${clinic?.street}, ${clinic?.addressNumber}`;

    const getProcedures = async () => {
        firebase
            .firestore()
            .collection("procedures")
            .where("clinicId", "==", id)
            .onSnapshot((snapshot) => {
                const procedures: Procedure[] = [];
                snapshot.forEach((doc) => {
                    procedures.push({
                        id: doc?.id,
                        name: doc?.data()?.name,
                        description: doc?.data()?.description,
                        price: doc?.data()?.price,
                    });
                    setProcedures(procedures);
                });
            });
    };

    const getUsedSlots = async () => {
        firebase
            .firestore()
            .collection("slots")
            .where("clinic", "==", id)
            .onSnapshot((snapshot) => {
                const slots: Slot[] = [];
                snapshot.forEach((doc) => {
                    slots.push({
                        day: doc?.data()?.day,
                        month: doc?.data()?.month,
                        clinic: doc?.data()?.clinic,
                        timeSlots: doc?.data()?.time_slot,
                        time: doc?.data()?.time,
                    });
                    setUsedSlots(slots);
                });
            });
    };

    const getSlots = () => {
        let week = eachDayOfInterval({
            start: startOfWeek(new Date(), { weekStartsOn: 1 }),
            end: endOfWeek(new Date(), { weekStartsOn: 1 }),
        });

        week.pop();
        week.pop();

        const timeSlots = createIntervals();

        const weekDays = week.map((day) => {
            return {
                text: format(day, "ccc", { locale: ptBR, weekStartsOn: 1 }),
                month: format(day, "LLL", { locale: ptBR, weekStartsOn: 1 }),
                day: format(day, "dd", { locale: ptBR, weekStartsOn: 1 }),
                timeSlots: timeSlots,
            };
        });

        weekDays.forEach((day) => {
            day.timeSlots.forEach((slot) => {
                usedSlots.forEach((usedSlot) => {
                    if (usedSlot.day === day.day && usedSlot.time === slot) {
                        day.timeSlots = day.timeSlots.filter(
                            (slot1) => slot1 !== slot
                        );
                    }
                });
            });
        });

        return weekDays;
    };

    const createIntervals = () => {
        let value = {
            interval: "00:30:00",
            startTime: "08:30:00",
            endTime: "17:30:00",
        };

        let result = value.interval;
        let start = "";
        let timeNotation = "";
        let time = "";
        for (let i in result) {
            let hr = moment(result, "HH:mm").format("HH");
            let min = moment(result, "HH:mm").format("mm");
            hr = hr != 0 ? parseInt(hr, 10) : "";
            min = min != 0 ? parseInt(min, 10) : "";
            if (hr != 0) {
                time = hr;
                timeNotation = "hour";
                start = moment(value.startTime, "HH:mm").subtract(hr, "hour");
            } else {
                time = min;
                timeNotation = "minutes";
                start = moment(value.startTime, "HH:mm").subtract(
                    min,
                    "minutes"
                );
            }
        }
        let end = moment(value.endTime, "HH:mm");
        if (end.isBefore(start)) end = end.add(1, "d");
        let finalResult = [];
        let current = moment(start);
        let currentInterval = "";
        while (current <= end) {
            currentInterval = current.format("HH:mm") + " - ";
            current.add(time, timeNotation);
            currentInterval += current.format("HH:mm");
            finalResult.push(currentInterval);
        }

        const toBeRemoved = ["12:00 - 12:30", "12:30 - 13:00", "13:00 - 13:30"];

        finalResult = finalResult.filter((slot) => !toBeRemoved.includes(slot));

        return finalResult;
    };

    const slots = getSlots();

    const styleModal = {
        position: "absolute",
        top: "50%",
        textAlign: "center",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };

    const handleTimeClick = (time: string, slot: object) => {
        setSelectedTime(time);
        setSelectedSlot(slot);
        setOpen(true);
    };

    const handleSubmit = async () => {
        const payload = {
            clinic: id,
            day: selectedSlot.day,
            month: selectedSlot.month,
            user: user.uid,
            time: selectedTime,
            time_slot: selectedSlot,
        };

        const result = await firebase
            .firestore()
            .collection("slots")
            .add(payload);

        setOpen(false);

        if (!!result) {
            toast.success("Horário marcado com sucesso!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            toast.error("Ocorreu um erro ao agendar este horário!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        await getUsedSlots();
    };

    useEffect(() => {
        getClinic();
        getProcedures();
        getUsedSlots();
    }, []);

    if (!!clinic) {
        return (
            <div>
                <MainHeader />
                <Box
                    sx={{
                        margin: "100px auto",
                        display: "flex",
                        justifyContent: "center",
                        gap: "60px",
                        maxWidth: 1300,
                        flexWrap: "wrap",
                    }}
                    maxWidth="sm"
                >
                    <Modal
                        open={open}
                        onClose={() => setOpen(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={styleModal}>
                            <Typography>
                                Deseja agendar esse horário?
                            </Typography>
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Typography
                                    sx={{
                                        marginBottom: 2,
                                        marginTop: 2,
                                    }}
                                >
                                    {selectedSlot.day}/{selectedSlot.month} às{" "}
                                    {selectedTime}
                                </Typography>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    onClick={handleSubmit}
                                >
                                    Confirmar
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                    <Box
                        sx={{
                            border: 1,
                            borderRadius: 1,
                            borderColor: "divider",
                            p: 1,
                            height: "fit-content",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                            }}
                        >
                            <Box
                                sx={{
                                    marginRight: 4,
                                }}
                            >
                                <Avatar
                                    alt="Foto clínica"
                                    src={clinic.image}
                                    variant="square"
                                    sx={{ width: 130, height: 130 }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="h3">
                                    {clinic.name}
                                </Typography>
                                <Typography>{clinic.description}</Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ marginTop: 2 }}>Detalhes</Divider>
                        <Box>
                            {!!clinic.state &&
                            !!clinic.city &&
                            !!clinic.state &&
                            !!clinic.addressNumber ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography>
                                        Endereço: {clinic.state}, {clinic.city},{" "}
                                        {clinic.state}, {clinic.addressNumber}
                                    </Typography>
                                    <Link
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURI(
                                            address
                                        )}`}
                                        target={"_blank"}
                                    >
                                        <Tooltip title="Abrir no mapa">
                                            <Icon>open_in_new</Icon>
                                        </Tooltip>
                                    </Link>
                                </Box>
                            ) : null}
                            <Typography
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                Aceita Unimed:{" "}
                                {clinic.acceptInsurance ? (
                                    <Icon fontSize="small" color="success">
                                        check_circle
                                    </Icon>
                                ) : (
                                    <Icon fontSize="small" color="error">
                                        cancel
                                    </Icon>
                                )}
                            </Typography>
                            {clinic.expertises.length > 0 ? (
                                <Typography
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    Especialidades:{" "}
                                    {clinic.expertises.join(", ")}
                                </Typography>
                            ) : null}
                        </Box>
                        {clinic.phone || clinic.website || clinic.email ? (
                            <Box>
                                <Divider sx={{ marginTop: 2 }}>Contato</Divider>
                                <Box>
                                    {clinic.phone ? (
                                        <Typography
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            Telefone: {clinic.phone}
                                            <Link
                                                target={"_blank"}
                                                href={`https://wa.me/55${clinic.phone
                                                    .replace("(", "")
                                                    .replace(")", "")
                                                    .replace(
                                                        " ",
                                                        ""
                                                    )}?text=Olá, vi sua clínica pelo Aiqdor e gostaria de agenda uma consulta.`}
                                            >
                                                <WhatsAppIcon
                                                    color="success"
                                                    sx={{ display: "flex" }}
                                                />
                                            </Link>
                                        </Typography>
                                    ) : null}
                                </Box>
                                <Box>
                                    {clinic.email ? (
                                        <Typography>
                                            E-mail: {clinic.email}
                                        </Typography>
                                    ) : null}
                                </Box>
                                <Box>
                                    {clinic.website ? (
                                        <Typography>
                                            <Link href={clinic.website}>
                                                Site
                                            </Link>
                                        </Typography>
                                    ) : null}
                                </Box>
                            </Box>
                        ) : null}
                        {procedures.length > 0 ? (
                            <Box>
                                <Divider sx={{ marginTop: 2 }}>
                                    Procedimentos
                                </Divider>
                                {procedures.map((procedure) => (
                                    <Box
                                        sx={{
                                            border: 1,
                                            borderColor: "lightgrey",
                                            borderRadius: 2,
                                            p: 2,
                                            m: 1,
                                            display: "flex",
                                        }}
                                    >
                                        <Box
                                            key={procedure.id}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                width: "100%",
                                            }}
                                        >
                                            <Box>
                                                <Box>
                                                    <Typography>
                                                        {procedure.name}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography>
                                                        Preço: {procedure.price}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography>
                                                        Descrição:{" "}
                                                        {procedure.description}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Link>
                                                <Button>Agendar</Button>
                                            </Link>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        ) : null}
                        {!clinic.showTimeSlots ? (
                            <Link
                                className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-sghohy-MuiButtonBase-root-MuiButton-root"
                                display="flex"
                                color="#fff"
                                backgroundColor="#2196f3"
                                padding="6px 16px"
                                borderRadius="8px"
                                alignItems="center"
                                justifyContent="center"
                                underline="none"
                                href={`https://wa.me/55${clinic.phone
                                    .replace("(", "")
                                    .replace(")", "")
                                    .replace(
                                        " ",
                                        ""
                                    )}?text=Olá, vi sua clínica pelo Aiqdor e gostaria de agenda um horário.`}
                            >
                                Agendar horário
                                <WhatsAppIcon sx={{ display: "flex" }} />
                            </Link>
                        ) : null}
                    </Box>
                    {clinic.showTimeSlots ? (
                        <Box>
                            <Box
                                sx={{
                                    border: 1,
                                    borderRadius: 1,
                                    borderColor: "divider",
                                    p: 1,
                                    minWidth: 400,
                                }}
                            >
                                <Divider
                                    sx={{
                                        textAlign: "center",
                                    }}
                                >
                                    Selecione um horário para agendar
                                </Divider>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    gap="10px"
                                >
                                    {slots.map((slot) => (
                                        <Box key={slot.text} maxWidth="130px">
                                            <Box
                                                textAlign="center"
                                                sx={{
                                                    boxShadow: 1,
                                                    marginBottom: 1,
                                                }}
                                            >
                                                <Typography>
                                                    {slot.text}
                                                </Typography>
                                                <Typography fontSize="18px">
                                                    {slot.day} / {slot.month}
                                                </Typography>
                                            </Box>
                                            <Box
                                                className="custom-scrollbar"
                                                textAlign="center"
                                                maxHeight="400px"
                                                sx={{
                                                    overflowY: "scroll",
                                                }}
                                            >
                                                {slot.timeSlots.map((time) => (
                                                    <Button
                                                        variant="contained"
                                                        sx={{
                                                            marginBottom: 1,
                                                        }}
                                                        onClick={() =>
                                                            handleTimeClick(
                                                                time,
                                                                slot
                                                            )
                                                        }
                                                    >
                                                        {time}
                                                    </Button>
                                                ))}
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    ) : null}
                </Box>
            </div>
        );
    } else {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                Carregando...
            </Box>
        );
    }
};

export default ClinicPage;

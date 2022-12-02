
// @ts-nocheck
import { useContext, useEffect, useState } from "react";
import { Box, Button, Link, Icon, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth";
import { MainHeader } from "../../components/main-header";
import firebase from "firebase";
import { Appointment } from "../../types/Appointment";

const UserPage = () => {
    const { isOwner } = useContext(AuthContext);
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const {user} = useContext(AuthContext);

    const getAppointments = async () => {
        const appointments = await firebase
            .firestore()
            .collection("slots")
            .where("user", "==", user?.uid)
            .get();
        const appointmentsData = appointments.docs.map((doc) => ({
            clinic: doc.data().clinic,
            time: doc.data().time,
            user: doc.data().user,
            day: doc.data().time_slot.day,
            month: doc.data().time_slot.month,
            text: doc.data().time_slot.text,
        })) as Appointment[];

        setAppointments(appointmentsData);

        // load clinics info from appointments
        appointmentsData.forEach(async (appointment) => {
            const clinic = await firebase.firestore().collection("clinics").doc(appointment.clinic).get();
            const clinicData = clinic.data();
            if (clinicData) {
                appointment.clinic_name = clinicData.name;
                appointment.clinic_address = `${clinicData?.state}, ${clinicData?.city}, ${clinicData?.street}, ${clinicData?.addressNumber}`;
            }
            setAppointments([...appointmentsData]);
        });

    };

    useEffect(() => {
        getAppointments();
    }, []);

    return (
        <div>
            <MainHeader />

            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Button sx={{m: 1}}
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/profile")}
                >
                    {"Editar Perfil"}
                </Button>

                {isOwner ? (
                    <Button sx={{m: 1}}
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/clinics")}
                    >
                        {"Clinicas"}
                    </Button>
                ) : null}

                <Box>
                    <h2>Próximos Horários</h2>
                    <TableContainer component={Paper}>
                    <Table 
                        sx={{ minWidth: 650 }} 
                        aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Clínica</TableCell>
                                <TableCell align="center">Data</TableCell>
                                <TableCell align="center">Horário</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appointments.map((appointment) => (
                                <TableRow
                                    key={appointment.time}
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                >
                                    <TableCell
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1,
                                        }}>

                                        {appointment.clinic_name}
                                        
                                        <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURI(
                                            appointment.clinic_address
                                            )}`}
                                            target={"_blank"}
                                            >
                                            <Tooltip title="Abrir no mapa">
                                                <Icon>open_in_new</Icon>
                                            </Tooltip>
                                        </Link>
                                            </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        {appointment.text} - {appointment.day}/{appointment.month}
                                    </TableCell>
                                    <TableCell align="center">{appointment.time}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
                </Box>
                    
            </Box>
        </div>
    );
};

export default UserPage;

import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import firebase from "firebase";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth";

const MenuIcon = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [userAvatarUrl, setUserAvatarUrl] = React.useState("");
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getUserAvatar = async () => {
        const user = firebase.auth().currentUser;

        if (user) {
            const userAvatar = await firebase
                .firestore()
                .collection("users")
                .doc(user.uid)
                .get();

            setUserAvatarUrl(userAvatar.data()?.image);
            console.log(userAvatar.data()?.image);
        }
    };

    const { isAuthenticated, logout, isAdmin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleAuthButton = () => {
        if (isAuthenticated) {
            logout(false);
        } else {
            navigate("/login");
        }
    };

    React.useEffect(() => {
        getUserAvatar();
    }, []);

    return (
        <React.Fragment>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                }}
            >
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                    >
                        <Avatar src={userAvatarUrl} sx={{ width: 32, height: 32 }}></Avatar>
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                {isAuthenticated ? (
                    <Box>
                        <MenuItem>
                            <Button
                                variant="text"
                                onClick={() => navigate(isAdmin ? "/admin" : "/user")}
                            >
                                <Avatar src={userAvatarUrl} /> Perfil
                            </Button>
                        </MenuItem>
                        <Divider />
                    </Box>
                ) : null}
                <Button>
                    {isAuthenticated ? (
                        <MenuItem onClick={handleAuthButton}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Sair
                        </MenuItem>
                    ) : (
                        <MenuItem onClick={handleAuthButton}>Entrar</MenuItem>
                    )}
                </Button>
            </Menu>
        </React.Fragment>
    );
};

export { MenuIcon };

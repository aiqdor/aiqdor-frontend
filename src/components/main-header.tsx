import {
    AppBar,
    Toolbar,
    Typography,
    Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { MenuIcon } from "./menu-icon";

const MainHeader = () => {

    return (
        <AppBar position="static">
            <Toolbar variant="dense">
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <Link
                        to="/"
                        style={{ textDecoration: "none", color: "white" }}
                    >
                        <Typography
                            variant="h6"
                            color="inherit"
                            component="div"
                        >
                            Aiqdor
                        </Typography>
                    </Link>
                    <MenuIcon />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

MainHeader.propTypes = {};

export { MainHeader };

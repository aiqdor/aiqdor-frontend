import PropTypes from "prop-types";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import React from "react";

export const MainHeader = ({ ...rest }) => (
    <AppBar position="static">
        <Toolbar variant="dense">
            <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
            >
                {/* <MenuIcon /> */}
            </IconButton>
            <Typography variant="h6" color="inherit" component="div">
                Aiqdor
            </Typography>
        </Toolbar>
    </AppBar>
);

MainHeader.propTypes = {};
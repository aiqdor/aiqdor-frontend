import PropTypes from "prop-types";
import { Box, TextField, Select, Chip } from "@mui/material";
import React from "react";



const SearchBar = ({}) => {
    const [options, setOptions] = React.useState([]);

    return (
        <Box sx={{ my: 2, mx: "auto" }} borderRadius={2} width="30%">
            <Select multiple>
                {options.map((option) => (
                    <Chip label={option} />
                ))}
            </Select>
            <TextField variant="outlined"></TextField>
        </Box>
    );
};

SearchBar.propTypes = { options: PropTypes.array };

export { SearchBar };

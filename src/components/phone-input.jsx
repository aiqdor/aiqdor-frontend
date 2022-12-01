import InputMask from 'react-input-mask';
import TextField from "@mui/material/TextField";

const PhoneInput = ({ value, onChange }) => {
    return (
        <InputMask mask="(99) 99999-9999" value={value} onChange={onChange}>
            {() => <TextField sx={{
                            width: "40%",
                        }}
                        required
                        id="outlined-required"
                        label="Telefone"
                        type="text"/>}
        </InputMask>
    );
};

export { PhoneInput };
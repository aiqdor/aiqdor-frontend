import InputMask from 'react-input-mask';
import TextField from "@mui/material/TextField";

const CepInput = ({ value, onChange }) => {
    return (
        <InputMask mask="99999-999" value={value} onChange={onChange}>
            {() => <TextField sx={{
                            width: "40%",
                        }}
                        required
                        id="outlined-required"
                        label="CEP"
                        type="text"/>}
        </InputMask>
    );
};

export { CepInput };
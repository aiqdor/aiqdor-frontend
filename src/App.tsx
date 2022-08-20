import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React from 'react';

function App() {
  return (
    <div className="App">
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          required
          id="outlined-required"
          label="Username"
        />
        <TextField required
            id="outlined-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
          />
      </Box>
    </div>
  );
}

export default App;

import { useState } from 'react';
import { Typography, FormControl, MenuItem, Box } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface ContorlDayProps {
  items: String[];
  onDayChange: (selectedIdx: number) => void;
}

export default function ContorlDay({ items, onDayChange }: ContorlDayProps) {

  let [, setSelected] = useState(-1)
  //let items = config.search_options || []
  let options = items.map((item, index) => (
    <MenuItem key={index} value={index}>
      {item}
    </MenuItem>
  ));

  const handleChange = (event: SelectChangeEvent) => {
    let idx = parseInt(event.target.value)
    setSelected(idx);
    onDayChange(idx);
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="center" sx={{
      minWidth: 150,
      gap: 2
    }}>
      <Typography component="h2" variant="h6" color="#F2EFE9">
        Día:
      </Typography>
      <FormControl fullWidth>
        <Select
          id="simple-select"
          defaultValue='0'
          onChange={handleChange}
          sx={{
            '& .MuiSelect-select': {
              color: "#F2EFE9", // Color del texto del elemento seleccionado
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: "#F2EFE9", // Color del borde de la caja
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: "#F2EFE9", // Color del borde al pasar el mouse
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: "#F2EFE9", // Color del borde al enfocarse
            },
            '& .MuiSelect-icon': {
              color: "#F2EFE9", // Color del ícono desplegable
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: "#F2EFE9", // Fondo del menú desplegable
                '& .MuiMenuItem-root.Mui-selected': {
                  backgroundColor: '#bbdefb', // Fondo del elemento seleccionado
                },
                '& .MuiMenuItem-root:hover': {
                  backgroundColor: '#90caf9', // Fondo de un elemento al pasar el mouse
                },
              },
            },
          }}
        >
          {options}
        </Select>
      </FormControl>
    </Box>
  )
}


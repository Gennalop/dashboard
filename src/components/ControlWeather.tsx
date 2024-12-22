{/* Hooks */ }
import { useState, useRef } from 'react';

{/* Componentes MUI */ }
import {Paper, Typography, Box, MenuItem, FormControl} from '@mui/material';
//import Select from '@mui/material/Select';

{/* Interfaz SelectChangeEvent */ }
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface ControlWeatherProps {
    onVariableChange: (selectedIdx: number) => void;
}

export default function ControlWeather({ onVariableChange }: ControlWeatherProps) {

    {/* Constante de referencia a un elemento HTML */ }
    const descriptionRef = useRef<HTMLDivElement>(null);

    {/* Variable de estado y función de actualización */ }
    let [, setSelected] = useState(-1)

    {/* Arreglo de objetos */ }
    let items = [
        { "name": "Todos", "description": "" },
        { "name": "Precipitación", "description": "Cantidad de agua que cae sobre una superficie en un período específico." },
        { "name": "Temperatura", "description": "Medida de la cantidad de calor en la atmósfera, expresada en grados Celsius." },
        { "name": "Humedad", "description": "Cantidad de vapor de agua presente en el aire, generalmente expresada como un porcentaje." },
        { "name": "Nubosidad", "description": "Grado de cobertura del cielo por nubes, afectando la visibilidad y la cantidad de luz solar recibida." }
    ]

    {/* Arreglo de elementos JSX */ }
    let options = items.map((item, key) => <MenuItem key={key} value={key}>{item["name"]}</MenuItem>)

    {/* Manejador de eventos */ }
    const handleChange = (event: SelectChangeEvent) => {

        let idx = parseInt(event.target.value)
        //alert(idx);
        setSelected(idx);
        onVariableChange(idx); // Actualiza el estado en App.tsx
        {/* Modificación de la referencia descriptionRef */ }
        if (descriptionRef.current !== null) {
            descriptionRef.current.innerHTML = (idx >= 0) ? items[idx]["description"] : ""
        }

    };

    {/* JSX */ }
    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#292929'
            }}
        >

            <Typography mb={2} component="h3" variant="h6" color="#F2EFE9">
                Variables Meteorológicas
            </Typography>

            <Box sx={{ minWidth: 120 }}>

                <FormControl fullWidth>
                    <Select
                        labelId="simple-select-label"
                        id="simple-select"
                        defaultValue='-1'
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
                        <MenuItem key="-1" value="-1" disabled>Seleccione una variable</MenuItem>
                        {options}
                    </Select>
                </FormControl>

            </Box>

            <Typography ref={descriptionRef} mt={2} component="p" color="#F2EFE9" />

        </Paper>


    )
}
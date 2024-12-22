import { Button, Typography, Box } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useEffect, useState } from 'react';
import '../App.css'

function AppHeader() {
    const [currentTime, setCurrentTime] = useState(new Date());

    // Función para obtener la hora actual en tiempo real
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Función para formatear la fecha y hora
    const formatDateTime = (date: Date): string => {
        const optionsDate: Intl.DateTimeFormatOptions = {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        };
        const rawDate = date.toLocaleDateString("es-ES", optionsDate);
        const fixedDate = rawDate
            .split(" ")
            .map((word) => {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalizar
            })
            .join(" ")
            .replace(/\bDe\b/gi, "")
            .replace(/\s+/g, " ")
            .trim();
        const formattedTime = date
            .toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            });
        return `${fixedDate}. Hora Actual: ${formattedTime}`;
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <Box>
            <Box className="AppHeader" display="flex" justifyContent="space-between" alignItems="center">
                <Typography>Weather Dashboard</Typography>
                <Button onClick={handleRefresh}>
                    <RefreshIcon sx={{ mr: "10px" }} />
                    Actualizar
                </Button>
            </Box>
            <Box className="AppHeaderInfo" display="flex" flexDirection='column' justifyContent="center" sx={{
                backgroundImage: 'url(/dashboard/img/ph1.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backgroundBlendMode: 'overlay',
            }}>
                <Typography sx={{ mt: 2 }}>
                    {formatDateTime(currentTime)}
                </Typography>
                <Typography component="p" variant="h1" color="#F2EFE9">
                    Guayaquil
                </Typography>
            </Box>
        </Box>
    );
}

export default AppHeader;
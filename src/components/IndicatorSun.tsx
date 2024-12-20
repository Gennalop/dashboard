import { Typography, Paper, Box } from "@mui/material";
//import Typography from '@mui/material/Typography';
//import Paper from '@mui/material/Paper';

interface Indicator {
    value_set?: string;
    value_rise?: string;
}

export default function IndicatorSun(config: Indicator) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Invalid date';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).format(date);
    };

    return (
        <>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 10,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <Typography component="h2" variant="h6"
                        color="primary" gutterBottom>
                        Amanecer
                    </Typography>
                    <Typography component="p" variant="h4" style={{ whiteSpace: 'nowrap' }}>
                        {formatDate(config.value_rise)}
                    </Typography>
                </Box>

                <img src='dashboard/img/sun.png' alt="Sun_rise_set" style={{ width: 'auto', height: '100px' }} />

                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <Typography component="h2" variant="h6"
                        color="primary" gutterBottom>
                        Atardecer
                    </Typography>
                    <Typography component="p" variant="h4" style={{ whiteSpace: 'nowrap' }}>
                        {formatDate(config.value_set)}
                    </Typography>
                </Box>

            </Paper>
        </>
    )
}
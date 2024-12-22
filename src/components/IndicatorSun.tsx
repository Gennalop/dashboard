import { Typography, Paper, Box } from "@mui/material";

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
                    flexWrap: 'wrap',
                    gap: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100px',
                    backgroundColor: '#292929',
                }}
            >
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <Typography component="h2" variant="h6"
                        color="#F2EFE9" gutterBottom>
                        Amanecer
                    </Typography>
                    <Typography component="p" variant="h4" color="#F2EFE9" style={{ whiteSpace: 'nowrap' }}>
                        {formatDate(config.value_rise)}
                    </Typography>
                </Box>
                
                <img src='/dashboard/img/sun.png' alt="sun" style={{ width: 'auto', height: '100px' }} />

                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <Typography component="h2" variant="h6"
                        color="#F2EFE9" gutterBottom>
                        Atardecer
                    </Typography>
                    <Typography component="p" variant="h4" color="#F2EFE9" style={{ whiteSpace: 'nowrap' }}>
                        {formatDate(config.value_set)}
                    </Typography>
                </Box>

            </Paper>
        </>
    )
}



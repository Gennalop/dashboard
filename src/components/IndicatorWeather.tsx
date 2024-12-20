import { Typography, Paper, Box } from "@mui/material";

interface Indicator {
    title?: String;
    value?: String;
    icon?: string;
}

export default function IndicatorWeather(config: Indicator) {
    return (
        <>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100px'
                }}
            >
                <img src={`/dashboard/img/${config.icon}`}  alt={config.icon} style={{ width: 'auto', height: '90px' }} />

                <Box display="flex" flexDirection="column" justifyContent="center">
                    <Typography component="h2" variant="h6"
                        color="primary" gutterBottom>
                        {config.title}
                    </Typography>
                    <Typography component="p" variant="h4">
                        {config.value}
                    </Typography>
                </Box>

            </Paper>
        </>
    )
}
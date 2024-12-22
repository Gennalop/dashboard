import { Typography, Paper, Box } from "@mui/material";
import Grid from '@mui/material/Grid'
import '../App.css'

interface Indicator {
    title?: String;
    value?: String;
    icon?: string;
}

export default function IndicatorWeather(config: Indicator) {
    return (
        <>
            <Paper className="PaperContent"
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100px',
                    backgroundColor: '#292929'
                }}
            >
                <Grid container spacing={5}>
                    <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <img src={`/dashboard/img/${config.icon}`} alt={config.icon} style={{ width: 'auto', height: '90px' }} />
                    </Grid>
                    <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Box display="flex" flexDirection="column" justifyContent='flex-end'>
                            <Typography component="h2" variant="h6"
                                color="#F2EFE9" gutterBottom>
                                {config.title}
                            </Typography>
                            <Typography component="p" variant="h4" color="#F2EFE9">
                                {config.value}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </>
    )
}
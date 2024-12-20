import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';
import ChartData from '../interface/ChartData';
import { useEffect, useState } from 'react';

interface LineChartWeatherProps {
    chartData: ChartData | null;
}

export default function LineChartWeather({ chartData }: LineChartWeatherProps) {

    const [precipitation, setPrecipitation] = useState<number[]>([]);
    const [temperature, setTemperature] = useState<number[]>([]);
    const [humidity, setHumidity] = useState<number[]>([]);
    const [cloudiness, setCloudiness] = useState<number[]>([]);
    const [xDays, setXDays] = useState<string[]>([]);

    // Hook: useEffect para actualizar los datos cuando llegan
    useEffect(() => {
        if (chartData) {
            setPrecipitation(chartData.precipitation);
            setTemperature(chartData.temperature);
            setHumidity(chartData.humidity);
            setCloudiness(chartData.cloudiness);
            setXDays(chartData.xDays);
        }
    }, [chartData]);

    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
            }}
        >

            {/* Componente para un gráfico de líneas */}
                <LineChart
                    height={400}
                    series={[
                        { data: precipitation, label: 'Precipitación' },
                        { data: temperature, label: 'Temperatura (°C)' },
                        { data: humidity, label: 'Humedad (%)' },
                        { data: cloudiness, label: 'Nubosidad (%)' },
                    ]}
                    xAxis={[{ scaleType: 'point', data: xDays }]}
                />

        </Paper>
    );
}
import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';
import ChartData from '../interface/ChartData';
import { useEffect, useState } from 'react';

interface LineChartWeatherProps {
    chartData: ChartData | null;
    selectedVariable: number;
}

export default function LineChartWeather({ chartData, selectedVariable }: LineChartWeatherProps) {
    const [dataToShow, setDataToShow] = useState<{ data: number[]; label: string }[]>([]);

    const items = [
        { name: "Todos", key: "all" },
        { name: "Precipitación", key: "precipitation" },
        { name: "Temperatura (°C)", key: "temperature" },
        { name: "Humedad (%)", key: "humidity" },
        { name: "Nubosidad (%)", key: "cloudiness" }
    ];

    useEffect(() => {
        if (chartData) {
            if (selectedVariable === -1 || selectedVariable === 0) {
                // Mostrar todas las variables si no hay selección
                setDataToShow([
                    { data: chartData.precipitation, label: "Precipitación" },
                    { data: chartData.temperature, label: "Temperatura (°C)" },
                    { data: chartData.humidity, label: "Humedad (%)" },
                    { data: chartData.cloudiness, label: "Nubosidad (%)" }
                ]);
            } else {
                // Mostrar solo la variable seleccionada
                const selectedItem = items[selectedVariable];
                if (selectedItem) {
                    const variableData = chartData[selectedItem.key as keyof ChartData];

                    // Verificar que el dato sea un array de números
                    if (Array.isArray(variableData) && typeof variableData[0] === 'number') {
                        setDataToShow([{ data: variableData as number[], label: selectedItem.name }]);
                    } else {
                        setDataToShow([]);
                    }
                }
            }
        }
    }, [selectedVariable, chartData]);

    return (
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <LineChart
                height={400}
                series={dataToShow}
                xAxis={[{ scaleType: 'point', data: chartData?.xDays || [] }]}
            />
        </Paper>
    );
}
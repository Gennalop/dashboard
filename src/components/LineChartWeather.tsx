import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';
import ChartData from '../interface/ChartData';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { useEffect, useState } from 'react';

interface LineChartWeatherProps {
    chartData: ChartData | null;
    selectedVariable: number;
}

export default function LineChartWeather({ chartData, selectedVariable }: LineChartWeatherProps) {
    const [dataToShow, setDataToShow] = useState<{ data: number[]; label: string; color: string }[]>([]);

    const items = [
        { name: "Todos", key: "all", color: "#000000" }, // Negro para "Todos"
        { name: "Precipitación", key: "precipitation", color: "#1f77b4" }, // Azul
        { name: "Temperatura (°C)", key: "temperature", color: "#ff7f0e" }, // Naranja
        { name: "Humedad (%)", key: "humidity", color: "#2ca02c" }, // Verde
        { name: "Nubosidad (%)", key: "cloudiness", color: "#d62728" } // Rojo
    ];

    useEffect(() => {
        if (chartData) {
            if (selectedVariable === -1 || selectedVariable === 0) {
                // Mostrar todas las variables si no hay selección
                setDataToShow([
                    { data: chartData.precipitation, label: "Precipitación", color: items[1].color },
                    { data: chartData.temperature, label: "Temperatura (°C)", color: items[2].color },
                    { data: chartData.humidity, label: "Humedad (%)", color: items[3].color },
                    { data: chartData.cloudiness, label: "Nubosidad (%)", color: items[4].color }
                ]);
            } else {
                // Mostrar solo la variable seleccionada
                const selectedItem = items[selectedVariable];
                if (selectedItem) {
                    const variableData = chartData[selectedItem.key as keyof ChartData];

                    // Verificar que el dato sea un array de números
                    if (Array.isArray(variableData) && typeof variableData[0] === 'number') {
                        setDataToShow([{ data: variableData as number[], label: selectedItem.name, color: selectedItem.color }]);
                    } else {
                        setDataToShow([]);
                    }
                }
            }
        }
    }, [selectedVariable, chartData]);

    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#292929'
            }}>
            <LineChart
                height={400}
                series={dataToShow}
                slotProps={{
                    legend: {
                        labelStyle: {
                            fill: "#F2EFE9",
                        },
                    },
                }}
                xAxis={[{ scaleType: 'point', data: chartData?.xDays || [] }]}
                sx={{
                    [`.${axisClasses.root}`]: {
                        [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                            stroke: "#F2EFE9",
                        },
                        [`.${axisClasses.tickLabel}`]: {
                            fill: "#F2EFE9",
                        },
                    },
                }}

                /*
                sx={{
                    //change left yAxis label styles
                    "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                        fill: "#F2EFE9"
                    },
                    "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                        stroke: "#F2EFE9"
                    },
                    // change bottom label styles
                    "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                        fill: "#F2EFE9"
                    },
                    // bottomAxis Line Styles
                    "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
                        stroke: "#F2EFE9"
                    }  
                }}
                */
            />
        </Paper>
    );
}
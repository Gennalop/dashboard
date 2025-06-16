import AppHeader from './components/AppHeader';
import IndicatorWeather from './components/IndicatorWeather';
import IndicatorSun from './components/IndicatorSun';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import ControlDay from './components/ControlDay';
import LineChartWeather from './components/LineChartWeather';
import Grid from '@mui/material/Grid2'
import Item from './interface/Item';
import ChartData from './interface/ChartData';
import './App.css'

import { Typography } from "@mui/material";

import { useEffect, useState } from 'react';

interface Indicator {
  title?: string;
  value?: string;
  icon?: string;
}

interface IndicatorSunSetRise {
  value_set?: string;
  value_rise?: string;
}

function App() {

  let [indicators, setIndicators] = useState<Indicator[]>([])
  let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))
  let [items, setItems] = useState<Item[]>([])
  let [indicatorSun, setIndicatorSun] = useState<IndicatorSunSetRise | null>(null)
  let [chartData, setChartData] = useState<ChartData | null>(null);
  let [days, setDays] = useState<String[]>([])
  let [selectedVariable, setSelectedVariable] = useState<number>(-1);
  let [selectedDay, setselectedDay] = useState<number>(0);

  useEffect(() => {
  const request = async () => {
    const savedTextXML = getOrFetchWeatherData();

    if (savedTextXML) {
      const xml = parseXML(savedTextXML);
      const locationData = extractLocationData(xml);
      const sunData = extractSunData(xml);
      const timeData = extractTimeData(xml);

      setIndicators(locationData.indicators);
      setItems(timeData.items);
      setDays(timeData.days);
      setIndicatorSun(sunData);
      setChartData(timeData.chartData);
    }
  };

  request();
}, [owm]);

  function getOrFetchWeatherData() {
  const cachedXML = localStorage.getItem("openWeatherMap") || "";
  const expiringTime = localStorage.getItem("expiringTime");
  const nowTime = Date.now();

  if (!expiringTime || nowTime > parseInt(expiringTime)) {
    return fetchAndCacheWeatherData(nowTime);
  }

  return cachedXML;
}

async function fetchAndCacheWeatherData(nowTime: number) {
  const API_KEY = "4bafda797df7d9cf29524ef087c17936";
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
  const xmlText = await response.text();

  const hours = 0.01;
  const delay = hours * 3600000;
  const expiringTime = nowTime + delay;

  localStorage.setItem("openWeatherMap", xmlText);
  localStorage.setItem("expiringTime", expiringTime.toString());
  localStorage.setItem("nowTime", nowTime.toString());
  localStorage.setItem("expiringDateTime", new Date(expiringTime).toString());
  localStorage.setItem("nowDateTime", new Date(nowTime).toString());

  setOWM(xmlText);
  return xmlText;
}

function parseXML(xmlString: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(xmlString, "application/xml");
}

function extractLocationData(xml: Document) {
  const location = xml.getElementsByTagName("location")[1];
  const latitude = location.getAttribute("latitude") || "";
  const longitude = location.getAttribute("longitude") || "";

  const indicators: Indicator[] = [
    { title: "Latitud", value: latitude, icon: "latitud.png" },
    { title: "Longitud", value: longitude, icon: "longitud.png" },
  ];

  return { indicators };
}

function extractSunData(xml: Document): IndicatorSunSetRise {
  const sunData = xml.getElementsByTagName("sun")[0];
  return {
    value_rise: sunData.getAttribute("rise") || "",
    value_set: sunData.getAttribute("set") || "",
  };
}

function extractTimeData(xml: Document) {
  const times = xml.getElementsByTagName("time");

  const daysData: string[] = [];
  const dataToItems: Item[] = [];
  const dataToChart: ChartData = {
    xDays: [],
    precipitation: [],
    temperature: [],
    humidity: [],
    cloudiness: [],
  };

  const dailyData: Record<string, {
    precipitation: number[];
    humidity: number[];
    temperature: number[];
    cloudiness: number[];
  }> = {};

  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const from = time.getAttribute("from")?.split("T") || [];
    const date = new Date(from[0]).toLocaleDateString(undefined, { day: "2-digit", month: "2-digit" });

    if (date && !daysData.includes(date)) {
      daysData.push(date);
      dailyData[date] = { precipitation: [], humidity: [], temperature: [], cloudiness: [] };
    }

    const item: Item = {
      date,
      dateStart: from[1],
      dateEnd: time.getAttribute("to")?.split("T")[1] || "",
      precipitation: time.querySelector("precipitation")?.getAttribute("probability") || "0",
      humidity: time.querySelector("humidity")?.getAttribute("value") || "0",
      clouds: time.querySelector("clouds")?.getAttribute("all") || "0",
    };

    dataToItems.push(item);

    dailyData[date].precipitation.push(parseFloat(item.precipitation) * 100);
    dailyData[date].humidity.push(parseFloat(item.humidity));
    dailyData[date].temperature.push(parseFloat(time.querySelector("temperature")?.getAttribute("value") || "0") - 273.15);
    dailyData[date].cloudiness.push(parseFloat(item.clouds));
  }

  for (const [date, data] of Object.entries(dailyData)) {
    dataToChart.xDays.push(date);
    dataToChart.precipitation.push(avg(data.precipitation));
    dataToChart.humidity.push(avg(data.humidity));
    dataToChart.temperature.push(avg(data.temperature));
    dataToChart.cloudiness.push(avg(data.cloudiness));
  }

  return {
    days: daysData,
    items: dataToItems,
    chartData: dataToChart,
  };
}

function avg(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
}


  let handleVariableChange = (selectedIdx: number) => {
    setSelectedVariable(selectedIdx);
  };

  let handleDayChange = (selectedIdx: number) => {
    setselectedDay(selectedIdx);
  };

  let renderIndicators = () => {
    return (
      <Grid container spacing={2}
        sx={{
          width: '100%',
          justifyContent: 'center', // Centra el contenido
        }}>
        {indicators.map((indicator, idx) => (
          <Grid key={idx} size={{ xs: 12, xl: 4 }}>
            <IndicatorWeather
              title={indicator["title"]}
              value={indicator["value"]}
              icon={indicator["icon"]} />
          </Grid>
        ))}
        {indicatorSun && (
          <Grid size={{ xs: 12, xl: 4 }}>
            <IndicatorSun
              value_set={indicatorSun["value_set"]}
              value_rise={indicatorSun["value_rise"]}
            />
          </Grid>
        )}
      </Grid>
    )
  }

  return (
    <div className="App">
      <AppHeader />

      <Grid className="AppContent" container spacing={5}>

        <Typography component="p" variant="h4" color="#F2EFE9">
          Pronóstico del Tiempo por 5 días
        </Typography>

        {renderIndicators()}

        <Grid container spacing={2} sx={{
          width: '100%',
          justifyContent: 'center',
        }}>
          <Grid size={{ xs: 12, xl: 3 }}>
            <ControlWeather onVariableChange={handleVariableChange} />
          </Grid>
          <Grid size={{ xs: 12, xl: 9 }}>
            {chartData && (
              <LineChartWeather chartData={chartData} selectedVariable={selectedVariable} />
            )}
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{
          width: '100%',
          justifyContent: 'center',
        }}>
          <Grid size={{ xs: 10, xl: 10 }} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Typography component="p" variant="h4" color="#F2EFE9">
              Pronóstico por cada 3 horas
            </Typography>
          </Grid>
          <Grid size={{ xs: 2, xl: 2 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography component="p" variant="h4" color="#F2EFE9">
              <ControlDay items={days} onDayChange={handleDayChange} />
            </Typography>
          </Grid>

        </Grid>

        <TableWeather itemsIn={items} selectedDay={days[selectedDay]}/>

      </Grid>
    </div>
  )
}

export default App

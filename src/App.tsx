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

{/* Hooks */ }
import { useEffect, useState } from 'react';

interface Indicator {
  title?: String;
  value?: String;
  icon?: string;
}

interface IndicatorSunSetRise {
  value_set?: string;
  value_rise?: string;
}

function App() {

  {/* Variable de estado y función de actualización */ }
  let [indicators, setIndicators] = useState<Indicator[]>([])
  let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))
  let [items, setItems] = useState<Item[]>([])
  let [indicatorSun, setIndicatorSun] = useState<IndicatorSunSetRise | null>(null)
  let [chartData, setChartData] = useState<ChartData | null>(null);
  let [days, setDays] = useState<String[]>([])
  let [selectedVariable, setSelectedVariable] = useState<number>(-1);
  let [selectedDay, setselectedDay] = useState<number>(0);

  {/* Hook: useEffect */ }
  useEffect(() => {
    let request = async () => {
      {/* Referencia a las claves del LocalStorage: openWeatherMap y expiringTime */ }
      let savedTextXML = localStorage.getItem("openWeatherMap") || "";
      let expiringTime = localStorage.getItem("expiringTime");

      {/* Obtenga la estampa de tiempo actual */ }
      let nowTime = (new Date()).getTime();

      {/* Verifique si es que no existe la clave expiringTime o si la estampa de tiempo actual supera el tiempo de expiración */ }
      if (expiringTime === null || nowTime > parseInt(expiringTime)) {

        {/* Request */ }
        let API_KEY = "4bafda797df7d9cf29524ef087c17936"
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
        let savedTextXML = await response.text();


        {/* Tiempo de expiración */ }
        let hours = 0.01
        let delay = hours * 3600000
        let expiringTime = nowTime + delay

        {/* En el LocalStorage, almacene el texto en la clave openWeatherMap, estampa actual y estampa de tiempo de expiración */ }
        localStorage.setItem("openWeatherMap", savedTextXML)
        localStorage.setItem("expiringTime", expiringTime.toString())
        localStorage.setItem("nowTime", nowTime.toString())

        {/* DateTime */ }
        localStorage.setItem("expiringDateTime", new Date(expiringTime).toString())
        localStorage.setItem("nowDateTime", new Date(nowTime).toString())

        {/* Modificación de la variable de estado mediante la función de actualización */ }
        setOWM(savedTextXML)

      }

      {/* Valide el procesamiento con el valor de savedTextXML */ }
      if (savedTextXML) {
        {/* XML Parser */ }
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");

        {/* Arreglo para agregar los resultados */ }
        let daysData: String[] = new Array<String>();
        let dataToIndicators: Indicator[] = new Array<Indicator>();
        let dataToItems: Item[] = new Array<Item>();
        let datoToIndicatorSun: IndicatorSunSetRise = {};
        let dataToCharData: ChartData = {
          xDays: [],
          precipitation: [],
          temperature: [],
          humidity: [],
          cloudiness: [],
        };

        {/* 
          Análisis, extracción y almacenamiento del contenido del XML 
          en el arreglo de resultados
        */}

        //let name = xml.getElementsByTagName("name")[0].innerHTML || ""
        //dataToIndicators.push({ "title": "Location", "subtitle": "City", "value": name })

        let location = xml.getElementsByTagName("location")[1]
        let latitude = location.getAttribute("latitude") || ""
        dataToIndicators.push({ "title": "Latitud", "value": latitude, "icon": "latitud.png" })
        let longitude = location.getAttribute("longitude") || ""
        dataToIndicators.push({ "title": "Longitud", "value": longitude, "icon": "longitud.png" })

        let sunData = xml.getElementsByTagName("sun")[0];
        let sunrise = sunData.getAttribute("rise") || "";
        let sunset = sunData.getAttribute("set") || "";
        datoToIndicatorSun = { "value_set": sunset, "value_rise": sunrise };

        const dailyData: Record<string, {
          precipitation: number[];
          humidity: number[];
          temperature: number[];
          cloudiness: number[];
        }> = {};

        let times = xml.getElementsByTagName("time");
        for (let i = 0; i < times.length; i++) {
          const time = times[i];
          const from = time.getAttribute('from')?.split('T') || "N/A";
          const date = new Date(from[0]).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
          if (date && !daysData.includes(date)) {
            dailyData[date] = { precipitation: [], humidity: [], temperature: [], cloudiness: [] };
            daysData.push(date);
          }
          const dateStart = from[1];
          const dateEnd = time.getAttribute("to")?.split("T")[1] || "N/A";
          const temperature = time.querySelector('temperature')?.getAttribute('value');
          const precipitation = time.querySelector("precipitation")?.getAttribute("probability") || "N/A";
          const humidity = time.querySelector("humidity")?.getAttribute("value") || "N/A";
          const clouds = time.querySelector("clouds")?.getAttribute("all") || "N/A";
          const item_i: Item = {
            date,
            dateStart,
            dateEnd,
            precipitation,
            humidity,
            clouds,
          };
          dataToItems.push(item_i);
          dailyData[date].precipitation.push(precipitation ? parseFloat(precipitation) * 100 : 0); //*100?==============================
          dailyData[date].humidity.push(humidity ? parseFloat(humidity) : 0);
          dailyData[date].temperature.push(temperature ? parseFloat(temperature) - 273.15 : 0); // Kelvin a Celsius
          dailyData[date].cloudiness.push(clouds ? parseFloat(clouds) : 0);
        }

        for (const [date, data] of Object.entries(dailyData)) {
          dataToCharData.xDays.push(date);
          dataToCharData.precipitation.push(data.precipitation.reduce((a, b) => a + b, 0) / data.precipitation.length);
          dataToCharData.humidity.push(data.humidity.reduce((a, b) => a + b, 0) / data.humidity.length);
          dataToCharData.temperature.push(data.temperature.reduce((a, b) => a + b, 0) / data.temperature.length);
          dataToCharData.cloudiness.push(data.cloudiness.reduce((a, b) => a + b, 0) / data.cloudiness.length);
        }

        {/* Modificación de la variable de estado mediante la función de actualización */ }
        setDays(daysData)
        setIndicators(dataToIndicators)
        setItems(dataToItems)
        setIndicatorSun(datoToIndicatorSun);
        setChartData(dataToCharData);

      }

    }

    request();
  }, [owm])

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

  {/* JSX */ }
  return (
    <div className="App">
      <AppHeader />

      <Grid className="AppContent" container spacing={5}>

        <Typography component="p" variant="h4" color="#F2EFE9">
          Pronóstico del Tiempo por 5 días
        </Typography>

        {/* Indicadores */}
        {renderIndicators()}

        {/* Grafico */}
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

        {/* Tabla */}
        <TableWeather itemsIn={items} selectedDay={days[selectedDay]}/>

      </Grid>
    </div>
  )
}

export default App

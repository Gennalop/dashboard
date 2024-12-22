import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Item from '../interface/Item';

import { useEffect, useState } from 'react';

interface MyProp {
  itemsIn: Item[];
  selectedDay: String;
}

export default function BasicTable({ itemsIn, selectedDay }: MyProp) {
  {/* Variable de estado y función de actualización */ }
  let [rows, setRows] = useState<Item[]>([])

  {/* Hook: useEffect */ }
  useEffect(() => {
    const filteredItems = itemsIn.filter(item => item.date === selectedDay);
    setRows(filteredItems);
  }, [itemsIn, selectedDay]);

  {/* JSX */ }
  return (
    <TableContainer component={Paper} sx={{ backgroundColor: '#292929' }}>
      <Table aria-label="simple table" sx={{ '& .MuiTableCell-root': { color: "#F2EFE9" } }}>
        <TableHead>
          <TableRow>
            <TableCell>Hora de Inicio</TableCell>
            <TableCell align="right">Hora de Fin</TableCell>
            <TableCell align="right">Precipitación</TableCell>
            <TableCell align="right">Humedad</TableCell>
            <TableCell align="right">Nubosidad</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow
              key={idx}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.dateStart}
              </TableCell>
              <TableCell align="right">{row.dateEnd}</TableCell>
              <TableCell align="right">{row.precipitation}</TableCell>
              <TableCell align="right">{row.humidity}</TableCell>
              <TableCell align="right">{row.clouds}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
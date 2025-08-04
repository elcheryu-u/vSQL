import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Paper } from '@u_ui/u-ui';
import React from 'react';

interface ResultsTableProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>No hay resultados para mostrar.</p>;
    }

    const columns = Object.keys(data[0]);

    return (
        <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 400 }}>
            <Table size='small' stickyHeader>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column} sx={{ fontWeight: 'bold' }}>
                                {column}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, i) => (
                        <TableRow key={i}>
                            {columns.map((col) => (
                                <TableCell key={col}>
                                    {row[col] !== null ? row[col].toString() : 'NULL'}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default ResultsTable;
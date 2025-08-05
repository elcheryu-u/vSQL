import { Checkbox, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { Box, styled } from '@u_ui/u-ui';
import React from 'react'
import { useParams } from 'react-router-dom';
import { visuallyHidden } from '@mui/utils';


interface Data {
    i: number;
    table: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'i',
        numeric: false,
        disablePadding: true,
        label: 'Tabla'
    }
]

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  headCells: Array<[]>,
  rowCount: number;
}

function EnhanceTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };
    
    return (
        <TableHead sx={{ backgroundColor: 'neutral.main' }}>
            <TableRow>
                <TableCell padding='checkbox' sx={{ borderTopLeftRadius: 8}}>
                    <Checkbox
                        color="secondary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                        'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        sx={{
                            '&:nth-last-of-type(1)': {
                                borderTopRightRadius: 8
                            }
                        }}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    transition: '.2s ease all',
    '&:hover': {
        backgroundColor: theme.palette.action.hover
    },
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.neutral.main,
        '&:hover': {
            backgroundColor: theme.palette.action.selected,
        },
    },
    '&:nth-of-type(1)': {
        '& td': {
            borderTopLeftRadius: 0
        },
        '& th:nth-last-of-type(1)': {
            borderTopRightRadius: 0
        }
    },
    '&.Mui-selected': {
        backgroundColor: theme.palette.action.focus,
        '&:hover': {
            backgroundColor: theme.palette.action.selected
        }
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function Table() {
    const { database, table } = useParams<{ database: string; table: string }>();

    const [data, setData] = React.useState<any>([]);
    const [columns, setColumns] = React.useState<any>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);
    
    React.useEffect(() => {
        if (!database || !table) return;

        async function fetchData() {
            try {
                const res = await fetch(`http://localhost:5000/databases/table?database=${database}&table=${table}`);
                const response = await res.json();

                if (!response.success) {
                    throw new Error(response.error || 'Failed to fetch data');
                }

                console.log(response)

                const result = response.data.map((value: string, index: number) => ({
                    table: value,
                    i: index,
                }));

                setData(result);
                setColumns(Object.keys(response.data[0]))
            } catch (err) {
                console.error(err);
                
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [database, table]);

    console.log('TABLAS', data);
    console.log('COLUMNS', columns)
    
    if (loading) return <p>Cargando...</p>
    if (error) return <p>Error: {error}</p>
    if (!data || data.length === 0) return <p>No hay datos.</p>

    return (
        <Box sx={{ flex: 1, minWidth: 300}}>
            <TableContainer>
                <EnhanceTableHead 
                    numSelected={-1}
                    headCells={columns}
                    order={'asc'}
                    rowCount={columns.length}
                />
            </TableContainer>
            {/* <Box>
                <TableContainer>
                    <Table>

                    </Table>
                    <TableBody>
                        
                    </TableBody>
                </TableContainer>
            </Box> */}
                {/* <thead>
                    <tr>
                    {data.length > 0 && Object.keys(data[0]).map((col) => (
                        <th key={col}>{col}</th>
                    ))}
                    </tr>
                </thead> */}
                {/* <tbody>
                    {data.map((row: any, index: number) => (
                    <tr key={index}>
                    {data.length > 0 && Object.keys(data[0]).map((col: string) => (
                        <td key={col}>{row[col]}</td>
                    ))}
                    </tr>
                ))}
                </tbody> */}
        </Box>
        
    )
}

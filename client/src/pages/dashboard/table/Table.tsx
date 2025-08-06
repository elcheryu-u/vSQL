import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';
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

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  headCells: [HeadCell],
  rowCount: number;
}

function EnhanceTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells } = props;
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

export default function TableDatabase() {
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

                const result = response.data.map((row: any, index: number) => ({
                    ...row,
                    _index: index,
                }));

                setData(result);

                const columnDefs = Object.keys(response.data[0]).map((key) => ({
                    id: key,
                    numeric: typeof response.data[0][key] === 'number',
                    disablePadding: false,
                    label: key.charAt(0).toUpperCase() + key.slice(1),
                }));

                setColumns(columnDefs);
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
        <Box sx={{ flex: 1, minWidth: 300, width: '100%'}}>
            <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%'}}>
                <Table>
                    <EnhanceTableHead 
                        numSelected={-1}
                        headCells={columns}
                        order={'asc'}
                        rowCount={columns.length}
                    />
                    <TableBody>
                        {data.map((row: any, rowIndex: any) => (
                            <StyledTableRow
                                hover
                                role='checkbox'
                                tabIndex={-1}
                                key={rowIndex}
                                selected={false}
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell
                                    padding='checkbox'
                                    sx={{ 
                                        borderColor: 'transparent'
                                    }}
                                >
                                    <Checkbox 
                                        color='secondary'
                                        checked={false}
                                    />
                                </TableCell>
                                {columns.map((column: HeadCell) => (
                                    <TableCell 
                                        key={column.id} 
                                        align={column.numeric ? 'right' : 'left'}
                                        component='th'
                                        id={column.id}
                                        scope='row'
                                        padding='none'
                                        sx={{
                                            py: 1.5,
                                            borderColor: 'transparent',
                                            userSelect: 'none'
                                        }}
                                    >
                                        {row[column.id] || 'NULL'}
                                    </TableCell>
                                ))}
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
        
    )
}

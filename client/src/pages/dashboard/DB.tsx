import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { Box, Grow, styled, Typography } from '@u_ui/u-ui';
import React from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { visuallyHidden } from '@mui/utils';
import ScrollContainer from '../../components/ScrollContainer';

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

const Tables = ({ db }: { db: string | undefined }) => {
    const navigate = useNavigate();

    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('i');
    const [tables, setTables] = React.useState<Array<{ table: string, i: number }>>([]);
    const [loading, setLoading] = React.useState<boolean>(true);

    const [selected, setSelected] = React.useState<readonly number[]>([]);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];

        if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
        );
        }
        setSelected(newSelected);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = tables.map((n) => n.i);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    React.useEffect(() => {
        const fetchTables = async () => {
            if (!db) return;
            try {
                const response = await fetch(`http://localhost:5000/databases/tables?database=${db}`);

                if (response.ok) {
                    const data = await response.json();
                    const result = Object.entries(data.tables).map(([key, value]) => ({
                        table: String(value),
                        i: Number(key),
                    }));
                    setTables(result);

                } else {
                    console.error('Error fetching tables');
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, [db]);

    console.log(tables);

    if (loading) {
        return <Typography variant='body1'>Cargando tablas...</Typography>
    }

    return (
        <Box sx={{ flex: 1, flexBasis: .5 }}>
            {tables.length > 0 ? (
                <Box>
                    <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%'}}>
                        <Table>
                            <EnhanceTableHead 
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={tables.length}
                            />
                            <TableBody>
                                {tables.map((table) => {
                                    const isItemSelected = selected.includes(table.i);
                                    const labelId = `table-${table}`;
                                    return (
                                        <StyledTableRow
                                            hover
                                            onClick={(event) => handleClick(event, table.i)}
                                            onDoubleClick={() => navigate(`/dashboard/db/${db}/${table.table}`)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={table.i}
                                            selected={isItemSelected}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell 
                                                padding='checkbox' 
                                                sx={{ 
                                                    borderColor: 'transparent'
                                                }}
                                            >
                                                <Grow in={isItemSelected && selected.length > 1} unmountOnExit>
                                                    <Checkbox 
                                                        color='secondary'
                                                        checked={true}
                                                    />
                                                </Grow>
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding='none'
                                                sx={{
                                                    py: 1.5,
                                                    borderColor: 'transparent',
                                                    userSelect: 'none'
                                                }}
                                            >
                                                {table.table}
                                            </TableCell>
                                        </StyledTableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            ) : (
                <Typography variant='body1'>No hay tablas en esta base de datos.</Typography>
            )}
        </Box>
    )
}

export default function DB() {
    const params = useParams<{ database: string }>();
    console.log(params.database);

    return (
        <Box sx={{
            display: 'flex',
            gap: 1,
            width: '100%',
            height: '100%',
            transition: '.2s ease all'
        }}>
            <ScrollContainer>
                <Tables db={params.database} />
            </ScrollContainer>
            <Box
                sx={{ transition: '.2s ease all', flex: location.pathname.split('/')[4] ? 1 : 0}}
            >
                <ScrollContainer>
                    <Outlet />
                </ScrollContainer>
            </Box>
        </Box>
    )
}

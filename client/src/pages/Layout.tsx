import React from 'react'
import { Box, Button, Divider, Paper, Typography } from '@u_ui/u-ui'
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LogoutRounded, StorageRounded } from '@mui/icons-material';
import { useConnection } from '../context/ConnectionContext';

const NavButton = ({ to, children }: { to: string, children: React.ReactNode }) => {
    const [isActive, setIsActive] = React.useState(window.location.pathname === to);
    const location = useLocation();

    React.useEffect(() => {
        setIsActive(location.pathname === to);
    }, [location.pathname, to]);

    return (
        <Button 
            component={Link} 
            to={to} 
            size='small'
            justify='start'
            variant={isActive ? 'contained' : 'text'}
            color={isActive ? 'neutral' : 'contrast'}
            sx={{ 
                borderRadius: .5, 
                textTransform: 'initial',
                px: 1,
                py: .5,
            }}
            disableIconAnimation
            startIcon={isActive ? <StorageRounded /> : undefined}
        >
            <Box sx={{ ml: .5}}>{children}</Box>
        </Button>
    )
};

export default function Layout() {
    const { disconnect } = useConnection();
    const [databases, setDatabases] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const location = useLocation();

    React.useEffect(() => {
        const fetchDatabases = async () => {
            try {
                const response = await fetch('http://localhost:5000/databases');
                if (response.ok) {
                    const data = await response.json();
                    setDatabases(data.databases || []);
                } else {
                    console.error('Error fetching databases');
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDatabases();
    }, []);

    React.useEffect(() => {
        const contentScroll = document.getElementById('content-scroll');
        contentScroll?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname])

    return (
        <Box sx={{ display: 'flex', gap: 1, p: 1}}>
            <Box sx={(theme) => ({ width: 250, height: `calc(100dvh - ${theme.spacing(2)})`, display: 'flex', flexDirection: 'column' })}>
                <Button to="/dashboard" component={Link} justify='start'>
                    <Typography variant='h5' textTransform='none' component='h1' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                        vSQL
                        <Typography variant='h6' fontSize={16} marginLeft={2} textTransform='none' component='span' >By Vandlee</Typography>
                    </Typography>
                </Button>
                <Divider sx={{ my: 2}} />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {loading ? (
                        <Typography variant='body1'>Cargando bases de datos...</Typography>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: .5 }}>
                            {databases.map((db) => (
                                <NavButton to={`/dashboard/db/${db}`} key={db} >
                                    {db}
                                </NavButton>
                            ))}
                        </Box>
                    )}
                </Box>
                <Button onClick={disconnect} variant='contained' color='neutral' startIcon={<LogoutRounded />}>
                    Cerrar sesión
                </Button>
            </Box>
            <Paper sx={(theme) => ({ flex: 1, height: `calc(100dvh - ${theme.spacing(2)})`, overflow: 'hidden' })}>
                <Box id="content-scroll" sx={{ p: 1.5, overflowY: 'auto', colorScheme: 'dark', height: '100%' }}>
                    <Outlet />
                </Box>
            </Paper>
        </Box>
    )
}

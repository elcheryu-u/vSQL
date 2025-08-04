import React from "react";
import { useConnection } from "../context/ConnectionContext";
import { Navigate } from "react-router-dom";
import { Box, Button, Collapse, Container, Divider, Typography } from "@u_ui/u-ui";
import { TextField } from "@mui/material";

const ConnectForm: React.FC = () => {
    const { connect, connected, disconnect } = useConnection();
    const [form, setForm] = React.useState({ host: 'localhost', user: 'root', password: ''});
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleConnect = async () => {
        setLoading(true);
        setError('');
        const success = await connect(form);
        if (!success) {
            setError('No se pudo conectar. Verifica los datos.');
        }
        setLoading(false);
    };

    const handleDisconnect = async () => {
        await disconnect();
    };

    if (connected) return <Navigate to="/dashboard" />;

    return (
        <Box sx={{ display: 'flex', height: '100dvh', alignItems: 'center'}}>
            <Container maxWidth="sm" style={{ padding: 16 }}>
                <Typography gutterBottom variant="h4" component='h1'>{connected ? "Conectado" : "Conectar a MySQL"}</Typography>

                {!connected ? (
                    <>
                        <TextField name="host" label="Host" fullWidth margin="normal" value={form.host} onChange={handleChange} />
                        <TextField name="user" label="Usuario" fullWidth margin="normal" value={form.user} onChange={handleChange} />
                        <TextField
                            label="Contraseña"
                            fullWidth
                            name="password"
                            margin="normal"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                        />
                        <Collapse in={Boolean(error)}>
                            <p style={{ color: "red" }}>{error}</p>
                        </Collapse>
                        <Divider sx={{ my: 2}} />
                        <Button variant="outlined" color='primary' fullWidth onClick={handleConnect} disabled={loading}>
                            {loading ? "Conectando..." : "Conectar"}
                        </Button>
                    </>
                ) : (
                    <Button onClick={handleDisconnect}>Desconectar</Button>
                )}
            </Container>  
        </Box>
    )
}

export default ConnectForm;
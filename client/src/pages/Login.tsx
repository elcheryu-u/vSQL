import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConnection } from "../context/ConnectionContext";
import { Button, Paper, Typography } from "@u_ui/u-ui";
import { TextField } from "@mui/material";

const Login = () => {
    const [host, setHost] = useState('localhost');
    const [user, setUser] = useState('root');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { connect } = useConnection();

    const handleConnect = async () => {
        setLoading(true);
        setError('');
        const success = await connect({ host, user, password });
        setLoading(false);

        if (success) {
            navigate('/dashboard');
        } else {
            setError('Conexión fallida. Verifica los datos.');
        }
    };

    return (
        <Paper>
            <Typography>
                Conectar a MySQL
            </Typography>

            <TextField label="Host" fullWidth margin="normal" value={host} onChange={(e) => setHost(e.target.value)} />
            <TextField label="Usuario" fullWidth margin="normal" value={user} onChange={(e) => setUser(e.target.value)} />
            <TextField
                label="Contraseña"
                fullWidth
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
                <Typography color="error" mt={2}>
                {error}
                </Typography>
            )}

            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleConnect}
                disabled={loading}
                sx={{ mt: 2 }}
            >
                {loading ? 'Conectado...' : 'Conectar'}
            </Button>
        </Paper>
    )
}

export default Login;
import { useState } from 'react';

export default function Connect() {
    const [form, setForm] = useState({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const connect = async () => {
        const res = await fetch('http://localhost:5000/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        });

        const data = await res.json();
        alert(data.success ? 'Conectado correctamente' : 'Error: ' + data.error);
    };

    return (
        <div>
        <h1>Conectar a MySQL</h1>
        {Object.entries(form).map(([key, value]) => (
            <div key={key}>
            <label>{key}</label>
            <input
                type={key === 'password' ? 'password' : 'text'}
                name={key}
                value={value}
                onChange={handleChange}
            />
            </div>
        ))}
        <button onClick={connect}>Conectar</button>
        </div>
    );
}

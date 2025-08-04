import { useState } from 'react';

export default function QueryEditor() {
    const [query, setQuery] = useState('');

    const handleRun = () => {
        alert('Consulta enviada:\n' + query);
        // Aquí se conectará al agente más adelante
    };

    return (
        <div style={{ padding: 16 }}>
        <h4>Editor SQL</h4>
        <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '100%', height: 100, fontFamily: 'monospace' }}
            placeholder="Escribe tu consulta SQL aquí..."
        />
        <button onClick={handleRun} style={{ marginTop: 8 }}>
            Ejecutar
        </button>
        </div>
    );
}

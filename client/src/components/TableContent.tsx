import { useParams } from 'react-router-dom';

export default function TableContent() {
    const { dbName, tableName } = useParams();

    return (
        <div style={{ flexGrow: 1, padding: 16 }}>
            <h2>
                {dbName} / {tableName}
            </h2>
            <p>Aquí se mostrarán las filas de la tabla, columnas, etc.</p>
        </div>
    );
}

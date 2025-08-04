import { Link, useParams } from 'react-router-dom';

const mockTables = ['actor', 'film', 'category'];

export default function TableList() {
    const { dbName } = useParams();

    return (
        <div style={{ width: 200, borderRight: '1px solid #ccc', padding: 16 }}>
            <h4>Tablas</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {mockTables.map((table) => (
                <li key={table}>
                    <Link to={`/db/${dbName}/table/${table}`} style={{ textDecoration: 'none', color: '#333' }}>
                    {table}
                    </Link>
                </li>
                ))}
            </ul>
        </div>
    );
}

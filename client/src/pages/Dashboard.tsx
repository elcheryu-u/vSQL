import Sidebar from "../components/Sidebar";

export default function Dashboard() {
    return (
        <div>
            <Sidebar />
            <div>
                <h1>
                    Bienvenido a vSQL
                </h1>
                <p>Selecciona una base de datos para comenzar.</p>
            </div>
        </div>
    )
}
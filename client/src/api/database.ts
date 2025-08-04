export async function fetchDatabases(): Promise<string[]> {
    const res = await fetch("http://localhost:5000/databases");
    if (!res.ok) {
        throw new Error("No se pudieron obtener las bases de datos");
    }
    const data = await res.json();
    return data.databases; // Asegúrate que el agente devuelve este formato
}

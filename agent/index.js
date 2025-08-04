import express, { json } from "express";
import cors from "cors";
import { createConnection } from "mysql2/promise";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(json());

let connection = null; // 🔗 conexión activa global

// ✅ /ping - comprobar si el agente está activo
app.get("/ping", (req, res) => {
  res.json({ online: true });
});

// ✅ /connect - crea una única conexión global
app.post("/connect", async (req, res) => {
  const { host, user, password } = req.body;

  if (!host || !user) {
    return res
      .status(400)
      .json({ success: false, error: "Datos incompletos." });
  }

  try {
    connection = await createConnection({ host, user, password });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ /query - ejecuta una consulta SQL
app.post("/query", async (req, res) => {
  if (!connection) {
    return res
      .status(400)
      .json({ success: false, error: "No hay conexión activa." });
  }

  const { sql } = req.body;
  if (typeof sql !== "string") {
    return res
      .status(400)
      .json({ success: false, error: "Consulta inválida." });
  }

  try {
    const [rows, fields] = await connection.query(sql);
    res.json({ success: true, data: rows, fields });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ /databases - obtiene la lista de bases de datos
app.get("/databases", async (req, res) => {
  if (!connection) {
    return res
      .status(400)
      .json({ success: false, error: "No hay conexión activa." });
  }

  try {
    const [rows] = await connection.query("SHOW DATABASES");
    const databases = rows.map((row) => row.Database);
    res.json({ success: true, databases });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/databases/tables", async (req, res) => {
  if (!connection) {
    return res
      .status(400)
      .json({ success: false, error: "No hay conexión activa." });
  }

  const { database } = req.query;

  if (!database) {
    return res
      .status(400)
      .json({ success: false, error: "Falta el parámetro 'database'." });
  }

  try {
    await connection.query(`USE \`${database}\``); // Cambiar de base de datos
    const [rows] = await connection.query("SHOW TABLES");
    const tables = rows.map((row) => Object.values(row)[0]);
    res.json({ success: true, tables });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});



// ✅ /disconnect - cierra la conexión
app.post("/disconnect", async (req, res) => {
  if (connection) {
    await connection.end();
    connection = null;
  }

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Agente corriendo en http://localhost:${PORT}`);
});

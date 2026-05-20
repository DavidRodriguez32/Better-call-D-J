// Importamos los módulos necesarios
const express = require("express");
const mysql = require("mysql2"); 
const cors = require("cors"); 


const server = express();
server.use(cors()); 
server.use(express.json()); 


const PORT = 3000;


const pool_mysql = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "better_call_dj",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

function iniciarServidor() {
   
    pool_mysql.getConnection((error, conexion) => {
        if (error) {
            console.error("Error conectando a MySQL:", error);
            process.exit(1); 
        }
        conexion.release();
        server.listen(PORT, () => {
            console.log(`Conectado a MySQL. Servidor corriendo en http://localhost:${PORT}`);
        });
    });
}
iniciarServidor();

// OBTENER AGENTES (GET)
server.get("/agentes", (req, res) => {
    const sql = "SELECT * FROM agenteDea";
    pool_mysql.query(sql, (error, resultados) => {
        if (error) {
            console.error("Error en la consulta de agentes:", error);
            return res.status(500).json({ error });
        }
        res.json(resultados);
    });
});

// OBTENER CLIENTES (GET) - Incluye el agente DEA asignado
server.get("/clientes", (req, res) => {
    const sql = `
        SELECT clientes.*, agenteDea.id_agente, agenteDea.nombre as nombre_agente
        FROM clientes
        LEFT JOIN clientes_agenteDea ON clientes.id_cliente = clientes_agenteDea.id_cliente
        LEFT JOIN agenteDea ON clientes_agenteDea.id_agente = agenteDea.id_agente
    `;
    pool_mysql.query(sql, (error, resultados) => {
        if (error) {
            console.error("Error en la consulta de clientes:", error);
            return res.status(500).json({ error });
        }
        res.json(resultados);
    });
});

// INSERTAR CLIENTE (POST)
server.post("/cliente", (req, res) => {
    const { nombre, alias, telefono, email, delito, id_agente } = req.body;
    const sql = `INSERT INTO clientes (nombre, alias, telefono, email, delito) VALUES (?, ?, ?, ?, ?)`;

    pool_mysql.query(sql, [nombre, alias, telefono, email, delito], (error, resultado) => {
        if (error) {
            console.error("Error en INSERT de cliente:", error);
            return res.status(500).json({ error });
        }

        const id_cliente = resultado.insertId;

        // Si se ha seleccionado un agente, lo vinculamos
        if (id_agente) {
            const sqlAgente = `INSERT INTO clientes_agenteDea (id_cliente, id_agente) VALUES (?, ?)`;
            pool_mysql.query(sqlAgente, [id_cliente, id_agente], (errorAgente) => {
                if (errorAgente) {
                    console.error("Error vinculando agente DEA:", errorAgente);
                    return res.status(500).json({ error: errorAgente });
                }
                res.json({ mensaje: "Cliente insertado y asignado a agente DEA" });
            });
        } else {
            res.json({ mensaje: "Cliente insertado correctamente" });
        }
    });
});

// ACTUALIZAR CLIENTE (PUT)
server.put("/cliente/:id_cliente", (req, res) => {
    const id_cliente = req.params.id_cliente;
    const { nombre, alias, telefono, email, delito, id_agente } = req.body;
    const sql = `UPDATE clientes SET nombre = ?, alias = ?, telefono = ?, email = ?, delito = ? WHERE id_cliente = ?`;
    
    pool_mysql.query(sql, [nombre, alias, telefono, email, delito, id_cliente], (error, resultado) => {
        if (error) {
            console.error("Error en UPDATE de cliente:", error);
            return res.status(500).json({ error });
        }
        
        // Borramos la asignación anterior para dejar la nueva
        const sqlBorrarAgente = `DELETE FROM clientes_agenteDea WHERE id_cliente = ?`;
        pool_mysql.query(sqlBorrarAgente, [id_cliente], (errorBorrar) => {
            if (errorBorrar) {
                console.error("Error borrando agente anterior:", errorBorrar);
                return res.status(500).json({ error: errorBorrar });
            }

            if (id_agente) {
                const sqlAsignarAgente = `INSERT INTO clientes_agenteDea (id_cliente, id_agente) VALUES (?, ?)`;
                pool_mysql.query(sqlAsignarAgente, [id_cliente, id_agente], (errorAsignar) => {
                    if (errorAsignar) {
                        console.error("Error asignando nuevo agente:", errorAsignar);
                        return res.status(500).json({ error: errorAsignar });
                    }
                    res.json({ mensaje: "Cliente actualizado y agente reasignado" });
                });
            } else {
                res.json({ mensaje: "Cliente actualizado (sin agente asignado)" });
            }
        });
    });
});

// ELIMINAR CLIENTE (DELETE)
server.delete("/cliente/:id_cliente", (req, res) => {
    const id_cliente = req.params.id_cliente;
    
    // Primero borramos la relación con el agente para evitar errores de foreign key
    const sqlBorrarAgente = `DELETE FROM clientes_agenteDea WHERE id_cliente = ?`;
    
    pool_mysql.query(sqlBorrarAgente, [id_cliente], (errorBorrar) => {
        if (errorBorrar) {
            console.error("Error al borrar relación de agente:", errorBorrar);
            return res.status(500).json({ error: errorBorrar });
        }

        // Ahora borramos el cliente
        const sql = "DELETE FROM clientes WHERE id_cliente = ?";
        pool_mysql.query(sql, [id_cliente], (error) => {
            if (error) {
                console.error("Error al eliminar cliente:", error);
                return res.status(500).json({ error });
            }
            res.json({ mensaje: "Cliente eliminado" });
        });
    });
});
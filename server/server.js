const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
    } else {
        console.log('Conexión exitosa con la base de datos SQLite');
        // Crear tabla si no existe
        db.run(`CREATE TABLE IF NOT EXISTS codigos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            type TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Rutas
app.get('/api/codigos', (req, res) => {
    db.all('SELECT * FROM codigos ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/codigos/:id', (req, res) => {
    db.get('SELECT * FROM codigos WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Código no encontrado' });
            return;
        }
        res.json(row);
    });
});

app.post('/api/codigos', (req, res) => {
    const { data, type } = req.body;
    if (!data || !type) {
        res.status(400).json({ error: 'Se requieren los campos data y type' });
        return;
    }

    db.run('INSERT INTO codigos (data, type) VALUES (?, ?)', [data, type], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            id: this.lastID,
            data,
            type,
            created_at: new Date().toISOString()
        });
    });
});

app.delete('/api/codigos/:id', (req, res) => {
    db.run('DELETE FROM codigos WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Código no encontrado' });
            return;
        }
        res.json({ message: 'Código eliminado exitosamente' });
    });
});

app.post('/api/scan', (req, res) => {
    const { qrData } = req.body;
    if (!qrData) {
        res.status(400).json({ error: 'Se requiere el campo qrData' });
        return;
    }

    db.run('INSERT INTO codigos (data, type) VALUES (?, ?)', [qrData, 'scanned'], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            success: true,
            data: {
                id: this.lastID,
                data: qrData,
                type: 'scanned',
                created_at: new Date().toISOString()
            }
        });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
}); 
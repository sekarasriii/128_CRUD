const express = require('express');
let mysql = require('mysql2');
const app = express();
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12baplanGGG',
    database: 'mahasiswa',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected Successfully.');
});

app.get('/api/mahasiswa', (req, res) => {
    db.query('SELECT * FROM biodata', (err, results) => {
        if (err) {
            console.error('Error executing query:'+ err.stack);
            res.status(500).send('Error fetching mahasiswa');
            return;
        }
        res.json(results);
    });
});

app.post('/api/mahasiswa', (req, res) => {
    const { nama, alamat, agama } = req.body;

    if (!nama || !alamat || !agama) {
        return res.status(400).json({ message : "Nama, Alamat, dan Agama harus diisi." });
    }

    db.query('INSERT INTO biodata (nama, alamat, agama) VALUES (?, ?, ?)', [nama, alamat, agama], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(201).json({ message: 'User created successfully', id: result.insertId });
    });
});

app.put('/api/mahasiswa/:id', (req, res) => {
    const userID = req.params.id;
    const { nama, alamat, agama } = req.body;
    db.query('UPDATE biodata SET nama = ?, alamat = ?, agama = ? WHERE id = ?', [nama, alamat, agama, userID], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json({ message: 'User updated successfully' });
    });
});

app.delete('/api/mahasiswa/:id', (req, res) => {
    const userID = req.params.id;
    db.query('DELETE FROM biodata WHERE id = ?', [userID], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json({ message: 'User deleted successfully' });
    });
});
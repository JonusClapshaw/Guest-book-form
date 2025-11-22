import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3003;

// Serve static files
app.use(express.static('public'));

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Create MySQL connection pool
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

// -----------------------
// Routes
// -----------------------

// Test database connection and list all contacts
app.get('/db-test', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM contacts ORDER BY timestamp DESC');
        res.json(rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Database error: ' + err.message);
    }
});

// Home page
app.get('/', (req, res) => {
    res.render('resume');
});

// Form page
app.get('/form', (req, res) => {
    res.render('home');
});

// Confirmation page
app.get('/confirm', (req, res) => {
    res.render("confirmation", { contact });
});

// Admin page - list all contacts
app.get('/admin', async (req, res) => {
    try {
        const [contacts] = await pool.query('SELECT * FROM contacts ORDER BY timestamp DESC');

        // Optional: format timestamp for display
        contacts.forEach(contact => {
            contact.formattedTimestamp = new Date(contact.timestamp).toLocaleString('en-US', { 
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        });

        res.render('admin', { contacts });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Database error: ' + err.message);
    }
});

// Return to form
app.post('/return', (req, res) => {
    res.render('home');
});

//submit form
app.post('/submit-order', async (req, res) => {
    try {
        const contact = req.body;

        const mailinglist = contact.method === 'mail' ? 'yes' : 'no';
        const formType = contact['type[]'] || '';

        const sql = `
        INSERT INTO contacts 
        (fname, lname, jtitle, company, linkedin, email, meet, other, message, mailinglist, form)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            contact.fname,
            contact.lname,
            contact.jtitle,
            contact.company,
            contact.linkedin,
            contact.email,
            contact.meet,
            contact.other,
            contact.message,
            mailinglist,
            formType
        ];

        const [result] = await pool.execute(sql, params);

        console.log("Inserted with ID:", result.insertId);

        // Pass the single contact to the template
        res.render("confirmation", { contact: contact });

    } catch (err) {
        console.error("Error inserting contact:", err);
        res.status(500).send("Database error: " + err.message);
    }
});

// -----------------------
// Start server
// -----------------------
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
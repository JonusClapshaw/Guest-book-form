import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ---------------------------
// Middleware
// ---------------------------

// Serve static files (CSS, JS, images) from "public"
app.use('/public', express.static(path.join(__dirname, 'public')));

// Parse form data
app.use(express.urlencoded({ extended: true }));

// ---------------------------
// View engine setup
// ---------------------------
app.set('view engine', 'ejs'); // use EJS
app.set('views', path.join(__dirname, 'views')); // explicit views folder

// ---------------------------
// Data storage
// ---------------------------
const guestEntries = [];

// ---------------------------
// Routes
// ---------------------------

// Home page
app.get('/', (req, res) => {
    res.render('home'); // looks for home.ejs in views
});

// Confirmation page
app.get('/confirm', (req, res) => {
    res.render('confirmation');
});

// Admin page
app.get('/admin', (req, res) => {
    res.render('admin', { guestEntries });
});

// Return to home
app.post('/return', (req, res) => {
    res.render('home');
});

// Form submission
app.post('/submit-order', (req, res) => {
    const guestEntry = {
        fname: req.body.fname,
        lname: req.body.lname,
        jtitle: req.body.jtitle,
        company: req.body.company,
        linkedin: req.body.linkedin,
        email: req.body.email,
        meet: req.body.meet,
        other: req.body.other,
        message: req.body.message,
        mailingList: req.body.mailingList,
        method: req.body.method
    };

    guestEntries.push(guestEntry);
    console.log(guestEntries);

    res.render('confirmation', { guestEntry });
});

// ---------------------------
// Start server
// ---------------------------
const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
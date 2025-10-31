import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const PORT = 3003;

// Set EJS as view engine and specify views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const guestEntries = [];

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/confirm', (req, res) => {
    res.render('confirmation');
});

app.get('/admin', (req, res) => {
    res.render('admin', { guestEntries });
});

app.post('/return', (req, res) => {
    res.render('home');
});

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

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
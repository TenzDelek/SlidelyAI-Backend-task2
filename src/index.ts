import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const dbPath = path.join(__dirname, 'db.json');

app.use(bodyParser.json());

// /ping endpoint
app.get('/ping', (req: Request, res: Response) => {
    res.json({ success: true });
});

// /submit endpoint
app.post('/submit', (req: Request, res: Response) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    
    if (!name || !email || !phone || !github_link || !stopwatch_time) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    db.submissions.push({ name, email, phone, github_link, stopwatch_time });
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.json({ success: true });
});

// /read endpoint
app.get('/read', (req: Request, res: Response) => {
    const { index } = req.query;
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    if (!index || isNaN(Number(index)) || Number(index) < 0 || Number(index) >= db.submissions.length) {
        return res.status(400).json({ error: 'Invalid index' });
    }

    res.json(db.submissions[Number(index)]);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

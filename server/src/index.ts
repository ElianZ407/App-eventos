import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('Eventos API is running');
});

// Auth Routes - Placeholder for manual JWT auth
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // TODO: Hash password and save to DB
        res.status(501).json({ message: 'Registration not implemented yet' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // TODO: Verify credentials and return JWT
        res.status(501).json({ message: 'Login not implemented yet' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Event Routes
app.get('/api/events', async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            include: {
                guests: true,
                tables: true,
            },
        });
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

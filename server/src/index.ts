import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Configurar dotenv para buscar el archivo en la raíz del proyecto
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import authRoutes from './routes/auth-routes';
import eventoRoutes from './routes/evento-routes';
import invitadoRoutes from './routes/invitado-routes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/invitados', invitadoRoutes);

// Compatibility alias (for previous test route)
app.use('/api/test-email', invitadoRoutes);

app.get('/', (req, res) => {
    res.send('EventFlow API is running in Spanish (Modulized version)');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import playerRoutes from './routes/player.routes.js';
import gameRoutes from './routes/game.routes.js';
import cardRoutes from './routes/card.routes.js';
import scoreRoutes from './routes/score.routes.js';
import apiRoutes from './routes/api.routes.js';

dotenv.config();

const app = express();
app.use(express.json());

// Conecta ao MongoDB
connectDB();

// Registra as rotas conforme a especificação
app.use('/api/players', playerRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running in port ${PORT}`);
});
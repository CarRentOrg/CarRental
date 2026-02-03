import express, { Request, Response } from 'express';
import cors from 'cors';
import colors from 'colors';
import dotenv from 'dotenv';
import carRoutes from './routes/carRoutes';
import bookingRoutes from './routes/bookingRoutes';
import statsRoutes from './routes/statsRoutes';
import newsRoutes from './routes/newsRoutes';
import userRoutes from './routes/userRoutes';
import ownerRoutes from './routes/ownerRoutes';
import requestRoutes from './routes/requestRoutes';
import { errorHandler } from './middlewares/errorHandler';

import { testDatabaseConnection } from './utils/dbQueries';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.get("/", (req: Request, res: Response) => {
    res.send("Hello Express Server");
});

app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/requests', requestRoutes);

// Error Handler
app.use(errorHandler);

app.listen(PORT, async () => {
    console.log((colors as any).rainbow(`Server started at http://localhost:${PORT}`));

    // Test DB connections
    await testDatabaseConnection();
});


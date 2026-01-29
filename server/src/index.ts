import express, { Request, Response } from 'express';
import cors from 'cors';
import colors from 'colors';
import dotenv from 'dotenv';
import carRoutes from './routes/carRoutes';
import bookingRoutes from './routes/bookingRoutes';
import statsRoutes from './routes/statsRoutes';
import newsRoutes from './routes/newsRoutes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
    res.send("Hello Express Server");
});

app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/news', newsRoutes);

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log((colors as any).rainbow(`Server started at http://localhost:${PORT}`));
});

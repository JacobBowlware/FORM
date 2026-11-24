import express from 'express';
import cors from 'cors';
import { ConnectToMongo } from './config/db.js';

// Router imports
import authRouter from './controllers/authController.js';
import workoutRouter from './controllers/workoutController.js';


// Initialize express app
const app = express();

// Connect to MongoDB (automatically terminates app if this fails)
await ConnectToMongo();

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000'],
}

// Active CORS middleware
app.use(cors(corsOptions));

// Allow express to parse JSON bodies
app.use(express.json());

// Setup routes from other API files
app.use('/api/auth', authRouter);
app.use('/api/workouts', workoutRouter);

// Get port from env var
const port = process.env.PORT | 3001;

// API file to handle workout requests
app.listen(port, () => {
    console.log(`Workout API server is running on port ${port}`);
});

export default app;
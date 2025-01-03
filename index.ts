import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import vendorRoutes from "./routes/vendorRoutes";


dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Connect to Database
connectDB();

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});
app.use("/api/vendors",vendorRoutes)

// Start the Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
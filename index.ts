import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import vendorRoutes from "./routes/vendorRoutes";
import {errorHandler} from "./error-handler/applicationError";
import logger from './utils/logger';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from "./swagger.json";
import apiLimiter from './middleware/rateLimiter';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Serve Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// rate limiting to all requests
app.use(apiLimiter);

// Connect to Database
connectDB();

// Middleware to log all incoming requests
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});
app.use("/api/vendors",vendorRoutes)

// Default 404 route
app.use((req,res)=>{
  res.status(404).json({success:false,message:"API not found. Please check our documentation for more information at http://localhost:4000/api-docs/"});
});

// Application-level error handling middleware
// Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`);
  next(err);
});

app.use(errorHandler);

// Start the Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
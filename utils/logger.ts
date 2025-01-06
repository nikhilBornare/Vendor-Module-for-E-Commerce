import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, errors, colorize } = format;

// Define a custom format for logs
const customFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

// Create Winston logger instance
const logger = createLogger({
    level: 'info', 
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }), 
        customFormat
    ),
    transports: [
        // Console log transport with colors
        new transports.Console({
            format: combine(colorize(), customFormat),
        }),

        // Daily log rotation for application logs
        new DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
          //  maxFiles: '14d',
            level: 'info', 
        }),

        // Error logs in a separate file
        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
           // maxFiles: '14d',
            level: 'error', 
        }),
    ],
});

export default logger;

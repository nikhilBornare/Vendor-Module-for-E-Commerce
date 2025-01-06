import { createLogger, format, transports } from 'winston';
//import { File } from 'winston/lib/winston/transports'; 

const { combine, timestamp, printf, errors, colorize } = format;

// format for logs
const customFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

// Create Winston logger 
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

        new transports.File({
            filename: 'logs/application.log', 
            level: 'info', 
        }),

        new transports.File({
            filename: 'logs/error.log', 
            level: 'error', 
        }),
    ],
});

export default logger;

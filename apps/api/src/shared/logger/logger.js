import winston from 'winston';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Formato legível para o console em desenvolvimento:
 * 2026-08-19 14:32:10 [error]: Mensagem do erro
 *     stack trace, se houver
 */
const devFormat = combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    printf(({ level, message, timestamp: ts, stack }) => {
        return `${ts} [${level}]: ${stack || message}`;
    })
);

/**
 * Formato estruturado (JSON) para produção — mais fácil de agregar
 * em ferramentas de log (CloudWatch, Datadog, ELK, etc.).
 */
const prodFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
    format: isProduction ? prodFormat : devFormat,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
    // Evita que o processo morra silenciosamente em exceções não tratadas
    exceptionHandlers: [new winston.transports.File({ filename: 'logs/exceptions.log' })],
    rejectionHandlers: [new winston.transports.File({ filename: 'logs/rejections.log' })],
});

export default logger;
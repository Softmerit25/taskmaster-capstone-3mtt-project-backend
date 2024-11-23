import rateLimit from 'express-rate-limit';

// Create a rate limiter
export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, 
    message: {
        status: 'failed',
        error: 'Too many requests, please try again later.',
    },
});
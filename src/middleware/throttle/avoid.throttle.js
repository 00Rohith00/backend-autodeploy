import rateLimit from 'express-rate-limit'

/**
 * This function creates an Express rate limit middleware. 
 * 
 * @function apiLimiter
 * @param {Object} options - The configuration options for the limiter.
 * @param {number} options.time - The time window for the limiter in milliseconds. Default is 1 minute (60 * 1000).
 * @param {number} options.max - The maximum number of requests allowed within the time window. Default is 30.
 * @param {Object} options.message - The message to be sent when the limit is reached. Default is '{Error: 'Too many requests, please try again later.'}'.
 * @return {Function} The rate limit middleware function.
 */
export const apiLimiter = ({ time = 60 * 1000, max = 10, message }) => {
    return rateLimit({ windowMs: time, max: max, message: message })
}
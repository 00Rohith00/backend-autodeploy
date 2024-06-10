/**
 * This module initializes the Express application and sets up middleware.
 * @module appSetup
 */

import express from 'express'
import cors from 'cors'

// Import API rate limiting middleware
import { apiLimiter } from './src/middleware/throttle/avoid.throttle.js'

/**
 * The Express application instance.
 * @type {express.Application}
 */
export const application = express()

/**
 * The Express router instance.
 * @type {express.Router}
 */
export const router = express.Router()

// Enable CORS
application.use(cors())

// Parse URL-encoded and JSON bodies
application.use(express.urlencoded({ extended: true }))
application.use(express.json({ limit: '10mb' }))

/**
 * Middleware to limit API requests.
 * @param {object} options - Options for API rate limiting middleware.
 * @param {object} options.message - Message to send when the request limit is exceeded.
 */
application.use(apiLimiter({ message: { Error: 'Too many requests, please try again later.' } }))


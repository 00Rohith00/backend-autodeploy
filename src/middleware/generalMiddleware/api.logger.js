import { getDate } from "../../utils/date.time.js"

/**
 * Logs the API request and response information along with the elapsed time.
 *
 * @function apiLogger
 * @param {Object} request - The request object.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void}
 */
const apiLogger = (request, response, next) => {
    const startTime = getDate()
    response.on('finish', () => {
        const endTime = getDate()
        const elapsedTime = endTime - startTime
        console.log(`API Logger:  ${request.method} ${request.url} - ${response.statusCode} ${elapsedTime}ms⌚`)
    })
    next()
}

export { apiLogger }
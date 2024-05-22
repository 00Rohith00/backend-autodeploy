/**
 * Generates a JSON response with the given status code and body.
 *
 * @param {Object} response - The response object to send the JSON response.
 * @param {number} statusCode - The status code of the response.
 * @param {Object} body - The data to be sent in the response.
 * @return {Object} The JSON response with the given status code and body.
 */
const jsonResponse = (response, statusCode, body) => {
    return response.status(statusCode).json({ ...body })
}

/**
 * Generates a successful response with the provided body or a default success message if no body is provided.
 *
 * @param {Object} response - The response object to send the response.
 * @param {Object} body - The data to be sent in the response or null.
 * @return {Object} The JSON response with a success status code and the provided body or default success message.
 */
export const okResponse = (response, body) => {
    return jsonResponse(response, 200, body ? body : { message: 'Successfully fetched...' })
}

/**
 * Generates a response with a 201 status code for successful creation, using the provided body or a default message.
 *
 * @param {Object} response - The response object to send the response.
 * @param {Object} body - The data to be sent in the response or null.
 * @return {Object} The JSON response with a 201 status code and the provided body or default success message.
 */
export const createdResponse = (response, body) => {
    return jsonResponse(response, 201, body ? body : { message: 'Created successfully...' })
}

/**
 * Generates an unauthorized response with the provided body or a default un-authorized message if no body is provided.
 *
 * @param {Object} response - The response object to send the response.
 * @param {Object} body - The data to be sent in the response or null.
 * @return {Object} The JSON response with a 401 status code and the provided body or default un-authorized message.
 */
export const unAuthorizedResponse = (response, body) => {
    return jsonResponse(response, 401, body ? body : { message: 'Un-authorized...' })
}

/**
 * Generates a forbidden response with the provided body or a default forbidden message if no body is provided.
 *
 * @param {Object} response - The response object to send the response.
 * @param {Object} body - The data to be sent in the response or null.
 * @return {Object} The JSON response with a 403 status code and the provided body or default forbidden message.
 */
export const forbiddenResponse = (response, body) => {
    return jsonResponse(response, 403, body ? body : { message: 'Forbidden...' })
}

/**
 * Generates a not found response with the provided body or a default message if no body is provided.
 *
 * @param {Object} response - The response object to send the response.
 * @param {Object} body - The data to be sent in the response or null.
 * @return {Object} The JSON response with a 404 status code and the provided body or default not found message.
 */
export const notFoundResponse = (response, body) => {
    return jsonResponse(response, 404, body ? body : { message: 'Page not found...' })
}

/**
 * Generates a response with a 500 status code for server errors, using the provided body or a default error message if no body is provided.
 *
 * @param {Object} response - The response object to send the response.
 * @param {Object} body - The data to be sent in the response or null.
 * @return {Object} The JSON response with a 500 status code and the provided body or default error message.
 */
export const failResponse = (response, body) => {
    return jsonResponse(response, 500, body ? body : { message: 'Not found...' })
}

/**
 * A function that generates a response with a 422 status code for Unprocessable Entity errors, using the provided body or a default message if no body is provided.
 *
 * @param {Object} response - The response object to send the response.
 * @param {Object} body - The data to be sent in the response or null.
 * @return {Object} The JSON response with a 422 status code and the provided body or default Unprocessable Entity message.
 */
export const UnprocessableEntity = (response, body) => {
    return jsonResponse(response, 422, body ? body : { message: 'Unprocessable Entity...' })
}

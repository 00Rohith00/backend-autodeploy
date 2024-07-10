import jwt from "jsonwebtoken"

import { unAuthorizedResponse, forbiddenResponse } from "../../utils/response.handle.js"
import { jwtToken } from "../../config/config.js"

/**
 * Verifies the authentication token in the request headers and sets the user token in the request body.
 *
 * @function tokenVerification
 * @param {Object} request - The request object containing headers and body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} - Returns an unauthorized response if the token is missing or invalid, or calls the next middleware function.
 */
export const tokenVerification = (request, response, next) => {

    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    const invalidAuthenticationToken = {
        "message": "invalid authentication token",
        "data": {},
    }

    if (!token) {
        return unAuthorizedResponse(response, {
            "message": "authentication token is missing",
            "data": {},
        })
    }

    jwt.verify(token, jwtToken.tokenKey, (error, user) => {

        if (error || user.token.user_id != request.body.user_id) {
            return forbiddenResponse(response, invalidAuthenticationToken)
        }
        request.body = { ...request.body, ...user.token }
        next()

    })
}
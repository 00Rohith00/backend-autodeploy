import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

import { jwtToken } from "../../config/config.js"


/**
 * Encrypts a password using bcrypt.
 *
 * @param {string} password - The password to be encrypted.
 * @return {string} The encrypted password.
 */
export const passwordEncryption = (password) => {
  try {
    return bcrypt.hashSync(password, 10)
  }
  catch (error) { throw error }
}

/**
 * Verifies if a given password matches a hashed password.
 *
 * @param {string} password - The password to be verified.
 * @param {string} hashPassword - The hashed password to compare against.
 * @return {boolean} Returns true if the password matches the hashed password, false otherwise.
 * @throws {Error} Throws an error if an error occurs during the comparison.
 */
export const verifyPassword = (password, hashPassword) => {
  try {
    return bcrypt.compareSync(password, hashPassword)
  }
  catch (error) { throw error }
}

/**
 * Generates a JSON Web Token (JWT) using the provided token details.
 *
 * @param {Object} tokenDetails - The details to be included in the token.
 * @return {string} The generated JWT.
 * @throws {Error} If an error occurs during token generation.
 */
export const generateJwtToken = (tokenDetails) => {
  try {
    return jwt.sign({ token: tokenDetails }, jwtToken.tokenKey, { expiresIn: jwtToken.tokenExpireIn })
  }
  catch (error) { throw error }
}
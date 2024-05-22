import * as dotenv from 'dotenv'
import { loadData } from '../utils/load.assets.js'

dotenv.config()

export const port = loadData("port", process.env.PORT)

/**
 * Returns the current environment based on the given value.
 *
 * @param {string} _now - The current environment value.
 * @return {string} The corresponding environment name.
 */
export let prod = (_now) => {
    switch (_now) {
        case "development":
            return "development"
        case "testing":
            return "testing"
        case "production":
            return "deployment"
        default:
            return "development"
    }
}

/**
 * Mongoose configuration object.
 * @typedef {Object} MongooseConfig
 * @property {string} URL - The URL of the MongoDB instance.
 */

/**
 * Returns the current Mongoose configuration.
 * @returns {MongooseConfig} The Mongoose configuration object.
 */
export const mongooseConfig = {
    URL: loadData("Mongo URL", process.env.MONGO_URL)
}



/**
 * API version configuration object.
 * @typedef {Object} ApiVersionConfig
 * @property {string} version - The API version.
 */

/**
 * Represents the API version configuration.
 * @type {ApiVersionConfig}
 */
export const apiVersion = loadData("api version", process.env.API_VERSION)

/**
 * JWT Token Configuration Object.
 * @typedef {Object} JwtTokenConfig
 * @property {string} tokenKey - The JWT secret key.
 * @property {string} tokenExpireIn - The JWT token expiration time.
 */

/**
 * Returns the JWT Token configuration.
 * @returns {JwtTokenConfig} The JWT Token configuration object.
 */
export const jwtToken = {
    tokenKey: loadData("JWT secret key", process.env.JWT_TOKEN_SECRET_KEY),
    tokenExpireIn: loadData("JWT token Expire in", process.env.JWT_EXPIRES_IN)
}

/**
 * Defines role IDs for different user roles.
 * @typedef {Object} RoleIds
 * @property {string} superAdmin - The ID of the super admin role.
 * @property {string} admin - The ID of the admin role.
 * @property {string} systemAdmin - The ID of the system admin role.
 * @property {string} doctor - The ID of the doctor role.
 */

/**
 * Role IDs for different user roles.
 * @type {RoleIds}
 */
export const roleId = {
    superAdmin: loadData("super admin role id", process.env.SUPER_ADMIN_ROLE_ID),
    admin: loadData("admin role id", process.env.ADMIN_ROLE_ID),
    systemAdmin: loadData("system admin role id", process.env.SYSTEM_ADMIN_ROLE_ID),
    doctor: loadData("doctor role id", process.env.DOCTOR_ROLE_ID)
}

/**
 * Defines role IDs for different user roles.
 * @typedef {Object} Role
 * @property {string} superAdmin - The ID of the super admin role.
 * @property {string} admin - The ID of the admin role.
 * @property {string} systemAdmin - The ID of the system admin role.
 * @property {string} doctor - The ID of the doctor role.
 */

/**
 * Role name for different user roles.
 * @type {Role}
 */
export const role = {
    superAdmin: loadData("super admin", process.env.SUPER_ADMIN),
    admin: loadData("admin", process.env.ADMIN),
    systemAdmin: loadData("system admin", process.env.SYSTEM_ADMIN),
    doctor: loadData("doctor", process.env.DOCTOR)
}

export const emailService = {
    apiKey: loadData("api key", process.env.EMAIL_SERVICE_API_KEY),
    audienceId: loadData("audience id", process.env.EMAIL_SERVICE_AUDIENCE_ID),
    server: loadData("server", process.env.EMAIL_SERVICE_SERVER)
}
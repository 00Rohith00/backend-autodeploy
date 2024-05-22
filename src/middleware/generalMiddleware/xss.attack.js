import xss from 'xss'
import { UnprocessableEntity, failResponse } from '../../helper/response.handle.js'

/**
 * Middleware function to sanitize request body against XSS attacks.
 *
 * @param {Object} request - The request object.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<void>} - A Promise that resolves when the middleware is done.
 * @throws {Error} - If the request body contains script tags.
 */
export const xssSanitization = (request, response, next) => {
  try {
    const data = request.body

    // Check if the body contains script tags
    if (typeof data === 'object' && containsScriptTags(data)) {
      throw new Error("Body contains script tags, which are not allowed.")
    }

    // Define options for XSS sanitization
    const xssOptions = {
      //parameters to remove tags
      whitelist: xss.whiteList,
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script'],
      // Specify the allowed HTML tags
      tags: {
        a: ['href', 'title', 'target'],
      }
    }

    const sanitizedData = sanitizeObject(data, xssOptions)

    // Check if any properties are present after sanitization
    if (Object.keys(sanitizedData).length > 0 && Object.keys(sanitizedData).length === Object.keys(data).length) {
      request.body = sanitizedData
      next()
    } else {
      UnprocessableEntity(response, { status: false, message: error.message })
    }
  } catch (error) {
    failResponse(response, { status: false, message: error.message })
  }
}

/**
 * Checks if the object contains script tags recursively.
 *
 * @param {Object} obj - The object to check for script tags.
 * @return {boolean} True if script tags are found, false otherwise.
 */
const containsScriptTags = (obj) => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      if (typeof value === 'string' && value.includes('<script>')) {
        return true
      } else if (typeof value === 'object' && containsScriptTags(value)) {
        return true
      }
    }
  }
  return false
}

/**
 * Recursively sanitizes an object against XSS attacks based on provided options.
 *
 * @param {Object} obj - The object to sanitize.
 * @param {Object} xssOptions - The options for XSS sanitization.
 * @return {Object} The sanitized object.
 */
const sanitizeObject = (obj, xssOptions) => {
  const sanitizedObj = {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      let sanitizedValue

      if (typeof value === 'object' && value !== null) {
        sanitizedValue = sanitizeObject(value, xssOptions)
      } else {
        sanitizedValue = xss(value, xssOptions)
      }

      const sanitizedKey = xss(key, xssOptions)

      // Skip storing key-value pairs if the key is 'script'
      if (sanitizedKey !== 'script') {
        sanitizedObj[sanitizedKey] = sanitizedValue
      }
    }
  }

  return sanitizedObj
}





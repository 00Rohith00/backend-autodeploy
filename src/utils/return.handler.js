/**
 * Creates and returns an object with status, message, and data properties.
 *
 * @function returnStatement
 * @param {any} status - The status value for the object.
 * @param {any} message - The message value for the object.
 * @param {any} data - The data value for the object.
 * @return {Object} An object containing status, message, and data properties.
 */
const returnStatement = (status, message, data) => {
    return {
        status: status,
        message: message,
        data: data ? data : {},
    }
}

export { returnStatement }
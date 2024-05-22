import { collections } from "../index.mongoose.js"


/**
 * Deletes documents from the specified collections based on the provided parameters in database.
 *
 * @param {Object} params - An object containing the key-value pairs representing the collection name and the document to delete.
 * @return {Promise<void>} A promise that resolves when all documents have been deleted.
 */
export const rollBackFunction = async (params) => {

    for (const [key, value] of Object.entries(params)) {
        await collections[key].deleteOne(value)
    }
}

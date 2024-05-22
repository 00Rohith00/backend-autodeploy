import seeder from '../../service/devServices/devSeederServices/seeder.js'
import clearData from '../../service/devServices/devSeederServices/clear.data.js'

import { okResponse, failResponse } from '../../utils/response.handle.js'

/**
 * This function seeds data into the database for development and testing purposes.
 *
 * @param {Object} request - The request object containing the data for seeding.
 * @param {Object} response - The response object used to send the result of the seeding operation.
 * @return {Promise<void>} A Promise that resolves when the seeding operation is complete.
 */

const seedDataApi = async (request, response) => {
    try {
        const result = await seeder.seedDataApi(request)
        if (result) {
            //write in success-logger database
            okResponse(response, result)
        }
    } catch (error) {
        // write in fail-logger database
        failResponse(response, { status: false, message: error })
    }
}

/**
 * THis function clears data from the database using the provided 
 * request for development and testing purposes.
 *
 * @param {Object} request - The request object containing the data for clearing.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const clearDataApi = async (request, response) => {
    try {
        const result = await clearData.clearDataApi(request)
        if (result) {
            //write in success-logger database
            okResponse(response, result)
        }
    } catch (error) {
        failResponse(response, { status: false, message: error })
    }
}

export default {
    seedDataApi, clearDataApi
}
import services from '../../service/officeServices/office.services.js'
import { okResponse, failResponse } from '../../utils/response.handle.js'

/**
 * This function create a new client through the Api and sends response as result 
 * and this is only created by developer
 * 
 * @param {Object} request - The request object containing the data for creating a new client.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} - A promise that resolves when the API call is complete.
 */
const createNewClientApi = async (request, response) => {
    try {
        const result = await services.createNewClientApi(request)
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
 * This function create a new super admin through the Api and sends response as result 
 * and this is only created by developer 
 * 
 * @param {Object} request - The request object containing the data for creating a new super admin.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} - A promise that resolves when the API call is complete.
 */
const createNewSuperAdminApi = async (request, response) => {
    try {
        const result = await services.createNewSuperAdminApi(request)
        if (result) {
            //write in success-logger database
            okResponse(response, result)
        }
    } catch (error) {
        // write in fail-logger database
        failResponse(response, { status: false, message: error })
    }
}


export default { createNewClientApi, createNewSuperAdminApi }
 
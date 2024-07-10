import services from "../../service/superAdminServices/super.admin.services.js"
import { okResponse, failResponse } from "../../utils/response.handle.js"

/**
 * Super admin creates a new admin through the API and sends the result as a response.
 *
 * @param {Object} request - The request object containing the data for creating a new admin.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} - A promise that resolves when the API call is complete.
 */
const createNewAdminApi = async (request, response) => {
    try {
        const result = await services.createNewAdminApi(request)
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
 * Super admin creates a new health center through the API and sends the result as a response.
 *
 * @param {Object} request - The request object containing the data for creating a new health center.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} - A promise that resolves when the API call is complete.
 */
const createNewHealthCenterApi = async (request, response) => {
    try {
        const result = await services.createNewHealthCenterApi(request)
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
 * Super admin creates a new robot for health center through the API and sends the result as a response.
 *
 * @param {Object} request - The request object containing the data for creating a new health center.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} - A promise that resolves when the API call is complete.
 */
const createNewRobotApi = async (request, response) => {
    try {
        const result = await services.createNewRobotApi(request)
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
 * Super admin handles the addition of a new scan through the API request and sends the result as a response
 * 
 * @param {Object} request - The request object containing the data for adding a new scan.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} - A Promise that resolves when the API call is complete.
 */
const addNewScanApi = async (request, response) => {
    try {
        const result = await services.addNewScanApi(request)
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
 * Super admin deletes a scan through the API request and sends the result as a response.
 *
 * @param {Object} request - The request object containing the data for deleting a scan.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} - A Promise that resolves when the API call is complete.
 */
const deleteScanApi = async (request, response) => {
    try {
        const result = await services.deleteScanApi(request)
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
 * Super admin adds a new department through the API request and sends the result as a response.
 *
 * @param {Object} request - The request object containing the data for adding a new department.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} - A Promise that resolves when the API call is complete.
 */
const addNewDepartmentApi = async (request, response) => {
    try {
        const result = await services.addNewDepartmentApi(request)
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
 * Super admin deletes a department through the API request and sends the result as a response.
 *
 * @param {Object} request - The request object containing the data for deleting a department.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} - A Promise that resolves when the API call is complete.
 */
const deleteDepartmentApi = async (request, response) => {
    try {
        const result = await services.deleteDepartmentApi(request)
        if (result) {
            //write in success-logger database
            okResponse(response, result)
        }
    } catch (error) {
        // write in fail-logger database
        failResponse(response, { status: false, message: error })
    }
}


export default {
    createNewAdminApi, createNewHealthCenterApi,
    createNewRobotApi, addNewScanApi, deleteScanApi,
    addNewDepartmentApi, deleteDepartmentApi
}
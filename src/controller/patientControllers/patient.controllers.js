import services from "../../service/patientServices/patient.services.js"
import { okResponse, failResponse } from "../../utils/response.handle.js"

/**
 * Admin creates new patients through the API and sends the result as a response.
 *
 * @param {Object} request - The request object containing the data for creating new patients.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const createNewPatientsApi = async (request, response) => {
    try {
        const result = await services.createNewPatientsApi(request)
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
 * Admin retrieves the list of patients through the API and sends the result as a response.
 *
 * @param {Object} request - The request object containing the necessary data for retrieving the list of patients.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const listOfPatientsApi = async (request, response) => {
    try {
        const result = await services.listOfPatientsApi(request)
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
 * Admin edits patient details through the API and sends the result as a response.
 *
 * @param {Object} request - The request object containing the necessary data for editing patient details.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const editPatientDetailsApi = async (request, response) => {
    try {
        const result = await services.editPatientDetailsApi(request)
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
 * Admin retrieves previous history for the patient through the API and sends the result as a response.
 *
 * @param {Object} request - The request object containing the necessary data for retrieving previous history.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const previousHistoryApi = async (request, response) => {
    try {
        const result = await services.previousHistoryApi(request)
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
    createNewPatientsApi, listOfPatientsApi,
    previousHistoryApi, editPatientDetailsApi
}
import services from "../../service/doctorServices/doctor.services.js"
import { okResponse, failResponse } from "../../utils/response.handle.js"

/**
 * This function retrieves a list of doctors from the API and sends the result as a response.
 *
 * @param {Object} request - The request object containing the necessary data for the API call.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const listOfDoctorsApi = async (request, response) => {
    try {
        const result = await services.listOfDoctorsApi(request)
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
 * Asynchronously retrieves doctor details from the API and sends the result as a response.
 *
 * @param {Object} request - The request object containing the necessary data for the API call.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const doctorDetailsApi = async (request, response) => {
    try {
        const result = await services.doctorDetailsApi(request)
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
 * Asynchronously edits doctor details from the API and sends the result as a response.
 *
 * @param {Object} request - The request object containing the necessary data for the API call.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const editDoctorDetailsApi = async (request, response) => {
    try {
        const result = await services.editDoctorDetailsApi(request)
        if (result) {
            //write in success-logger database
            okResponse(response, result)
        }
    } catch (error) {
        // write in fail-logger database
        failResponse(response, { status: false, message: error })
    }
}


const listOfDepartmentsApi = async (request, response) => {
    try {
        const result = await services.listOfDepartmentsApi(request)
        if (result) {
            //write in success-logger database
            okResponse(response, result)
        }
    } catch (error) {
        // write in fail-logger database
        failResponse(response, { status: false, message: error })
    }
}


export default { listOfDoctorsApi, doctorDetailsApi, editDoctorDetailsApi, listOfDepartmentsApi }
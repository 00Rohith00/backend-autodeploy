import services from "../../service/appointmentServices/appointment.services.js"
import { okResponse, failResponse } from "../../utils/response.handle.js"

/**
 * Admin and System admin searches for patient information through the request.
 *
 * @param {Object} request - The request object.
 * @param {Object} response - The response object.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const searchPatientInformationApi = async (request, response) => {
    try {
        const result = await services.searchPatientInformationApi(request)
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
 * Admin and System admin retrieves a list of scan types from the API and sends the result as a response.
 *
 * @param {Object} request - The request object containing the necessary data for the API call.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const listOfScanTypesApi = async (request, response) => {
    try {
        const result = await services.listOfScanTypesApi(request)
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
 * Admin and System admin retrieves a list of hospital doctors from the API and sends the result as a response.
 *
 * @param {Object} request - The request object containing the necessary data for the API call.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const listOfHospitalDoctorsApi = async (request, response) => {
    try {
        const result = await services.listOfHospitalDoctorsApi(request)
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
 * Admin and System admin retrieves a list of health centers from the API and sends the result as a response.
 *
 * @param {Object} request - The request object containing the necessary data for the API call.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const listOfHealthCenterApi = async (request, response) => {
    try {
        const result = await services.listOfHealthCenterApi(request)
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
 * Admin and System admin retrieves a list of hospital robots from the API and sends the result as a response.
 *
 * @param {Object} request - The request object containing the necessary data for the API call.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */

const listOfHospitalRobotsApi = async (request, response) => {
    try {
        const result = await services.listOfHospitalRobotsApi(request)
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
 * Admin and System admin creates a new appointment through the request.
 *
 * @param {Object} request - The request object containing the data for creating a new appointment.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} - A promise that resolves when the API call is complete.
 */
const createNewAppointmentApi = async (request, response) => {
    try {
        const result = await services.createNewAppointmentApi(request)
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
 * Admin and System admin retrieves appointment details from the API and sends the result as a response.
 *
 * @param {Object} request - The request object containing the necessary data for the API call.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const appointmentDetailsApi = async (request, response) => {
    try {
        const result = await services.appointmentDetailsApi(request)
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
 * Admin and System admin cancels an appointment through the API and sends the result as a response.
 *
 * @param {Object} request - The request object containing the data for canceling an appointment.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} - A promise that resolves when the API call is complete.
 */
const cancelAppointmentApi = async (request, response) => {
    try {
        const result = await services.cancelAppointmentApi(request)
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
 * Admin and System admin edits an appointment through the API and sends the result as a response.
 *
 * @param {Object} request - The request object containing the data for editing an appointment.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} - A promise that resolves when the API call is complete.
 */
const editAppointmentApi = async (request, response) => {
    try {
        const result = await services.editAppointmentApi(request)
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
 * Admin and System admin retrieves a list of hospital appointments from the API and sends the result as a response.
 *
 * @param {Object} request - The request object containing the necessary data for the API call.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const listOfHospitalAppointmentsApi = async (request, response) => {
    try {
        const result = await services.listOfHospitalAppointmentsApi(request)
        if (result) {
            //write in success-logger database
            okResponse(response, result)
        }
    } catch (error) {
        // write in fail-logger database
        failResponse(response, { status: false, message: error })
    }
}

const rescheduleAppointmentApi = async (request, response) => {
    try {
        const result = await services.rescheduleAppointmentApi(request)
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
    searchPatientInformationApi, listOfScanTypesApi, listOfHospitalDoctorsApi, 
    listOfHealthCenterApi, listOfHospitalRobotsApi, createNewAppointmentApi,
    appointmentDetailsApi, cancelAppointmentApi, editAppointmentApi, listOfHospitalAppointmentsApi,
    rescheduleAppointmentApi
}
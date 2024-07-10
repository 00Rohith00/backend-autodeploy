import services from "../../service/reportServices/report.services.js"
import { okResponse, failResponse } from "../../utils/response.handle.js"


/**
 * Doctor and system admin handles the patient report through the API and sends the result
 *  as a response.
 *
 * @param {Object} request - The request object containing patient report data.
 * @param {Object} response - The response object to send back the API result.
 * @returns {Promise<void>} A Promise that resolves when the API call is complete.
 */
const patientReportApi = async (request, response) => {
    try {
        const result = await services.patientReportApi(request)
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
 * Doctor and system admin handles a list of reports from the service through 
 * the API and sends the result as a response.
 *
 * @param {Object} request - The request object containing data for retrieving the reports.
 * @param {Object} response - The response object to send back the API result.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const listOfReportsApi = async (request, response) => {
    try {
        const result = await services.listOfReportsApi(request)
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
 * Doctor and system admin handles the addition of a report template through the API 
 * and sends the result as a response.
 *
 * @param {Object} request - The request object containing the report template data.
 * @param {Object} response - The response object to send back the API result.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const addReportTemplateApi = async (request, response) => {
    try {
        const result = await services.addReportTemplateApi(request)
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
 * Doctor and system admin handles the list of report templates through the API and sends the result as a response.
 *
 * @param {Object} request - The request object containing data for the list of report templates.
 * @param {Object} response - The response object to send back the API result.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const listOfReportTemplatesApi = async (request, response) => {
    try {
        const result = await services.listOfReportTemplatesApi(request)
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
 * Doctor and system admin handles the deletion of a report template through the API 
 * and sends the result as a response.
 *
 * @param {Object} request - The request object containing the data for deleting the report template.
 * @param {Object} response - The response object to send back the API result.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const deleteReportTemplateApi = async (request, response) => {
    try {
        const result = await services.deleteReportTemplateApi(request)
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
    listOfReportsApi, patientReportApi,
    addReportTemplateApi, listOfReportTemplatesApi,
    deleteReportTemplateApi
}
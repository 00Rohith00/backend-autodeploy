import services from "../../service/adminServices/admin.services.js"
import { failResponse, okResponse } from "../../utils/response.handle.js"

/**
 *  Admin creates a new system admin through the request with provided data.
 *
 * @param {Object} request - The request object containing the data for creating a new system admin.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} - A promise that resolves when the API call is complete.
 */
const createNewSystemAdminApi = async (request, response) => {
  try {
    const result = await services.createNewSystemAdminApi(request)
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
 * Admin creates a new doctor through the request with provided data.
 *
 * @param {Object} request - The request object containing the data for creating a new doctor.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} - A promise that resolves when the API call is complete.
 */
const createNewDoctorApi = async (request, response) => {
  try {
    const result = await services.createNewDoctorApi(request)
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
  createNewSystemAdminApi, createNewDoctorApi
}
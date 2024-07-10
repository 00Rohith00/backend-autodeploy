import services from "../../service/authenticationServices/authentication.services.js"
import { okResponse, failResponse } from "../../utils/response.handle.js"

/**
 * This function checks if a user exists in the database using the provided request.
 *
 * @param {Object} request - The request object containing user data.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const isExistingUserApi = async (request, response) => {
  try {
    const result = await services.isExistingUserApi(request)
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
 * This function sets the password for a user through the request and sends the result as a response.
 *
 * @param {Object} request - The request object containing the data for setting the password.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const setPasswordApi = async (request, response) => {

  try {
    const result = await services.setPasswordApi(request)
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
 * This user login api function checks the provided data and allow the user to login  
 * through the API and sends the result as a response
 *
 * @param {Object} request - The request object containing the user's login credentials.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const userLoginApi = async (request, response) => {
  try {
    const result = await services.userLoginApi(request)
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
 * This function sends an OTP to user if the user forget the password and sends through the API based on the
 * provided request and logs the result.
 *
 * @param {Object} request - The request object containing the data needed to send the OTP.
 * @param {Object} response - The response object used to send the result of the API call.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const sendOtpApi = async (request, response) => {
  try {
    const result = await services.sendOtpApi(request)
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
 * This function check whether the user provided OTP is valid or not and sends through the API based on the
 * provided request and logs the result.
 *
 * @param {Object} request - The request object containing the OTP data to be verified.
 * @param {Object} response - The response object used to send the result of the verification.
 * @return {Promise<void>} A Promise that resolves when the OTP verification is complete.
 */
const verifyOtpApi = async (request, response) => {
  try {
    const result = await services.verifyOtpApi(request)
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
  isExistingUserApi, setPasswordApi,
  userLoginApi, sendOtpApi, verifyOtpApi
}
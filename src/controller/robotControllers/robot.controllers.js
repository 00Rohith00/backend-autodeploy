
import services from "../../service/robotServices/robot.services.js"
import { okResponse, failResponse } from "../../utils/response.handle.js"


/**
 * Admin and System admin that handles the API request to retrieve a list of robots, 
 * through the API and sends the result as a response.
 *
 * @param {Object} request - The request object sent to retrieve the list of robots.
 * @param {Object} response - The response object used to send back the API result.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const listOfRobotsApi = async (request, response) => {
    try {
        const result = await services.listOfRobotsApi(request)
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
 * Admin and system admin to check the maintenance status of a robot through the API and sends the result as a response.
 *
 * @param {Object} request - The request object for checking maintenance status.
 * @param {Object} response - The response object to send back the API result.
 * @return {Promise<void>} A Promise that resolves when the API call is complete.
 */
const robotMaintenanceStatusApi = async (request, response) => {
    try {
        const result = await services.robotMaintenanceStatusApi(request)
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
    listOfRobotsApi, robotMaintenanceStatusApi
}
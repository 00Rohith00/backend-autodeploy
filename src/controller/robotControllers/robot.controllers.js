
import services from "../../service/robotServices/robot.services.js"
import { okResponse, failResponse } from "../../utils/response.handle.js"


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


export default { listOfRobotsApi, robotMaintenanceStatusApi }
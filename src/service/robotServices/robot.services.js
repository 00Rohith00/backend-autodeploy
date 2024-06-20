import { role } from "../../config/config.js"
import { collections } from "../../mongoose/index.mongoose.js"
import { returnStatement } from "../../utils/return.handler.js"

const listOfRobotsApi = async (data) => {

    try {

        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id }, { _id: 0, client_id: 1 })

        if (userDetails && data.body.role_name == role.admin || data.body.role_name == role.systemAdmin) {

            const branchDetails = await collections.HealthCenterModel.find({ client_id: userDetails.client_id }, { _id: 0, branch_id: 1, branch_name: 1, branch_location: 1 })

            if (branchDetails.length == 0) return returnStatement(true, "list of robots", branchDetails)

            var listOfRobots = []

            const promises = branchDetails.map(async (branch) => {

                const robotDetails = await collections.RobotModel.find({ branch_id: branch.branch_id }, { robot_id: 1, robot_registration_id: 1, under_maintenance: 1, _id:0 })

                if (robotDetails.length != 0) {

                    robotDetails.forEach(async (robot) => { listOfRobots.push({ ...branch._doc, ...robot._doc }) })
                }
            })

            await Promise.all(promises)
            
            return returnStatement(true, "list of robots", listOfRobots)
        }
        else {
            throw returnStatement(false, !userDetails ? "user id is not found" : `${data.body.role_name} not able to view list of robots`)
        }
    }
    catch (error) {
        if (error.status == false && error.message) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}


const robotMaintenanceStatusApi = async (data) => {

    try {


    }
    catch (error) {
        if (error.status == false && error.message) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}






export default { listOfRobotsApi, robotMaintenanceStatusApi }
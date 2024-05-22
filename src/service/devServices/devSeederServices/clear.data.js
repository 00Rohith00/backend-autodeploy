import { collections } from "../../../mongoose/index.mongoose.js"
import { returnStatement } from "../../../utils/return.handler.js"

/**
 * Developers clears all documents from multiple collections in the database. This function performs a bulk deletion operation
 * on multiple collections, removing all documents within each collection. 
 * 
 * Additional Notes:
 * This office module, responsible for deletion, a bulk deletion operation on multiple collections 
 * has been developed by our development team and is managed by our dedicated support team.
 * 
 * @returns {Promise<Object>} A Promise that resolves to an object containing the status of the operation and a corresponding message.
 * If the data is cleared successfully from all collections, the status is true and the message is "Data cleared successfully."
 * If there is an error while deleting the data from any of the collections, the status is false and the message is 
 * "Error while deleting all the data in mongoose db".
 */
const clearDataApi = async () => {
  try {

    // Remove all documents from the collection
    await collections.HospitalClientModel.deleteMany({})
    await collections.AppointmentModel.deleteMany({})

    await collections.DoctorModel.deleteMany({})
    await collections.EmergencyAppointmentModel.deleteMany({})

    await collections.HealthCenterModel.deleteMany({})
    await collections.OnBoardingModel.deleteMany({})

    await collections.OtpModel.deleteMany({})
    await collections.PatientModel.deleteMany({})

    await collections.ReportModel.deleteMany({})
    await collections.RobotModel.deleteMany({})

    await collections.UserDetailModel.deleteMany({})
    await collections.UserLoginModel.deleteMany({})

    await collections.UserModel.deleteMany({})
    await collections.UserRoleModel.deleteMany({})

    return returnStatement(true, "Data cleared successfully.")

  } catch (error) {
    throw "Error while deleting all the data in mongoose db"
  }
}

export default { clearDataApi }
import { collections, rollBack } from "../../mongoose/index.mongoose.js"
import { role, roleId } from "../../config/config.js"
import { returnStatement } from "../../utils/return.handler.js"


/**
 * Super admin creates a new admin user in the system. This function takes in data containing user 
 * details such as user ID, name, email, contact number, location, pin code, role name, and image URL.
 * It validates the provided data and creates a new admin user in the system. If successful, it resolves to an 
 * object with a status indicating success and a corresponding message.If any error occurs during the process, 
 * it throws an Error.
 *
 * @param {Object} data - The data object containing the user details.
 * 
 * @param {string} data.body.user_id - The ID of the user creating the admin.
 * @param {string} data.body.user_name - The name of the admin user.
 * @param {string} data.body.user_email_id - The email ID of the admin user.
 * @param {string} data.body.user_contact_number - The contact number of the admin user.
 * @param {string} data.body.user_location - The location of the admin user.
 * @param {string} data.body.user_pin_code - The pin code of the admin user.
 * 
 * @param {string} data.body.role_name - The role name of the admin user.
 * @param {string} data.body.image_url - The URL of the admin user's image.
 * @return {Promise<Object>} A promise that resolves to an object with a status and a message.
 * @throws {Error} If there is an error in the process.
 */
const createNewAdminApi = async (data) => {

    const adminRollBackParams = {}
    try {

        const [superAdminDetails, isExistingEmailId] = await Promise.all([
            await collections.UserModel.findOne({ user_id: data.body.user_id }, { _id: 0, client_id: 1 }),
            await collections.UserDetailModel.findOne({ user_email_id: data.body.user_email_id })
        ])

        if (superAdminDetails != null && isExistingEmailId == null && data.body.role_name === role.superAdmin) {
            const personalDetails = {
                user_name: data.body.user_name,
                user_email_id: data.body.user_email_id,
                user_contact_number: data.body.user_contact_number,
                user_location: data.body.user_location,
                user_pin_code: data.body.user_pin_code,
                user_gender: data.body.user_gender,
                user_age: data.body.user_age,
                doctor: null
            }
            // inserting the admin's personal details in user_details collection
            const userDetailsCollection = await collections.UserDetailModel.create(personalDetails)

            if (userDetailsCollection._id) {

                // once the details are inserted into user_details the obj id of that record [row] is stored in the adminRollBackParams object
                adminRollBackParams.UserDetailModel = userDetailsCollection._id

                // inserting the admin's role details in user_role collection
                const userRolesCollection = await collections.UserRoleModel.create({ role_id: roleId.admin, role_name: role.admin })

                if (userRolesCollection._id) {

                    // once the details are inserted into user_roles the obj id of that record [row] is stored in the adminRollBackParams object
                    adminRollBackParams.UserRoleModel = userRolesCollection._id

                    const userLoginCollection = await collections.UserLoginModel.create({ update_count: 0 })

                    // inserting the admin's login details in user_login collection
                    if (userLoginCollection._id) {

                        // once the details are inserted into user_login the obj id of that record [row] is stored in the adminRollBackParams object
                        adminRollBackParams.UserLoginModel = userLoginCollection._id

                        const allDetails = {
                            client_id: superAdminDetails.client_id,
                            branch_id: null,
                            user_details: userDetailsCollection._id,
                            user_roles: userRolesCollection._id,
                            user_login: userLoginCollection._id,
                            image_url: data.body.image_url,
                            is_archive: false,
                            created_by: data.body.user_id
                        }

                        // inserting the admin's user details in users collection
                        const userCollection = await collections.UserModel.create(allDetails)

                        if (userCollection._id) {
                            return returnStatement(true, "admin is created")
                        }
                        else { throw error }
                    }
                    else { throw error }
                }
                else { throw error }
            }
            else { throw error }
        }
        else {
            throw returnStatement(false,
                superAdminDetails == null ? "used id is not found" :
                    isExistingEmailId != null ? "email id is already exists" :
                        `${data.body.role_name} user can't able to create new admin`)
        }
    }
    catch (error) {
        rollBack(adminRollBackParams)
        if (error.status == false && error.message != null) { throw error.message }
        else { throw  error._message ?  error._message : "internal server error" }
    }
}


/**
 * Super admin creates a new health center API endpoint. This function takes in data containing the user ID, role name, and 
 * details of the new health center such as branch name, contact number, location, and pin code. It validates 
 * the provided data and creates a new health center in the database. If successful, it returns a Promise that 
 * resolves to an object with a status and a message. If the user ID is not found, the user does not have the required role, 
 * or an error occurs while creating the new health center, throws an Error with an appropriate error message.
 *
 * @param {Object} data - The data object containing the user ID, role name, and details of the new health center.
 * @param {string} data.body.user_id - The ID of the user making the request.
 * @param {string} data.body.role_name - The role name of the user making the request.
 * 
 * @param {string} data.body.branch_name - The name of the new health center.
 * @param {string} data.body.branch_contact_number - The contact number of the new health center.
 * @param {string} data.body.branch_location - The location of the new health center.
 * @param {string} data.body.branch_pin_code - The pin code of the new health center.
 * 
 * @return {Promise<Object>} A promise that resolves to an object with a status and a message.
 * @throws {Error} If the user ID is not found, the user does not have the required role, or an error occurs while creating the new health center.
 */
const createNewHealthCenterApi = async (data) => {

    try {

        const superAdminDetails = await collections.UserModel.findOne({ user_id: data.body.user_id }, { _id: 0, client_id: 1 })

        if (superAdminDetails != null && data.body.role_name === role.superAdmin) {

            const healthCenterDetails = {
                client_id: superAdminDetails.client_id,
                branch_name: data.body.branch_name,
                branch_contact_number: data.body.branch_contact_number,
                branch_location: data.body.branch_location,
                branch_pin_code: data.body.branch_pin_code,
                created_by: data.body.user_id,
            }

            // inserting the health center details in health_center collection
            const createNewHealthCenter = await collections.HealthCenterModel.create(healthCenterDetails)

            if (createNewHealthCenter._id) {
                return returnStatement(true, "health center is created")
            }
            else { throw error }
        }
        else {
            throw returnStatement(false,
                superAdminDetails == null ? "used id is not found" :
                    `${data.body.role_name} user cannot create new health center`)
        }
    }
    catch (error) {
        if (error.status == false && error.message != null) { throw error.message }
        else { throw  error._message ?  error._message : "internal server error" }
    }
}

/**
 * Creates a new robot API. This function takes in data containing user information such as user ID, branch ID,
 * robot registration ID, and role name. It then validates the provided data and creates a new robot associated with the
 * specified branch in the database. If successful, it returns a Promise that resolves to an object with a status and a message 
 * indicating the success of the operation.If any error occurs during the process, it throws an Error with an appropriate
 * message detailing the nature of the error..
 *
 * @param {Object} data - The data object containing the user ID, branch ID, robot registration ID, and role name.
 * @param {string} data.body.user_id - The ID of the user making the request.
 * @param {string} data.body.branch_id - The ID of the branch associated with the robot.
 * @param {string} data.body.robot_registration_id - The registration ID of the robot.
 * @param {string} data.body.role_name - The role name of the user making the request.
 * @return {Promise<Object>} A promise that resolves to an object with a status and a message.
 * 
 * @throws {Error} If the user ID is not found, the branch ID is not found, the robot registration ID already exists, or the user does not have the required role.
 * @throws {Error} If an error occurs while retrieving the user or health center details, or while creating the new robot.
 * @throws {Error} If an error occurs while constructing the return statement.
 * @throws {Error} If an error occurs while handling the error.
 */
const createNewRobotApi = async (data) => {

    try {
        const [superAdminDetails, robotCollection] = await Promise.all([
            await collections.UserModel.findOne({ user_id: data.body.user_id }, { _id: 0, client_id: 1 }),
            await collections.RobotModel.findOne({ robot_registration_id: data.body.robot_registration_id })
        ])

        const healthCenterDetails = await collections.HealthCenterModel.findOne({ branch_id: data.body.branch_id, client_id: superAdminDetails.client_id })
        
        if (superAdminDetails != null && healthCenterDetails != null && robotCollection == null && data.body.role_name === role.superAdmin) {

            const robotDetails = {
                robot_registration_id: data.body.robot_registration_id,
                branch_id: data.body.branch_id,
                under_maintenance: false,
                created_by: data.body.user_id,
            }

            const createNewRobot = await collections.RobotModel.create(robotDetails)

            if (createNewRobot._id) {
                return returnStatement(true, "new robot created")
            }
            else { error }
        }
        else {
            throw returnStatement(false,
                superAdminDetails == null ? "used id is not found" :
                    healthCenterDetails == null ? "branch id is not found" :
                        data.body.role_name != role.superAdmin ? `${data.body.role_name} user can't able to create new robot` :
                            "robot registration id already exists")
        }
    }
    catch (error) {
        if (error.status == false && error.message != null) { throw error.message }
        else { throw  error._message ?  error._message : "internal server error" }
    }
}

const addNewScanApi = async (data) => {

    try {
        const superAdminDetails = await collections.UserModel.findOne({ user_id: data.body.user_id }, { _id: 0, client_id: 1 })

        if (superAdminDetails != null && data.body.role_name === role.superAdmin) {

            const clientDetails = await collections.HospitalClientModel.findOne({ client_id: superAdminDetails.client_id })

            if (clientDetails['scan_type'].includes(data.body.scan_type)) {
                throw returnStatement(false, "given scan type is already exist")
            }
            else {
                // adding new scan_type with an existing scan types
                await collections.HospitalClientModel.findOneAndUpdate(
                    { client_id: superAdminDetails.client_id },
                    { $push: { scan_type: data.body.scan_type } },
                    { new: true }
                )
                return returnStatement(true, "scan type is added")
            }
        }
        else {
            throw returnStatement(false,
                superAdminDetails == null ? "used id is not found" :
                    `${data.body.role_name} user cannot add new scan type`)
        }
    }
    catch (error) {
        if (error.status == false && error.message != null) { throw error.message }
        else { throw  error._message ?  error._message : "internal server error" }
    }
}

const deleteScanApi = async (data) => {

    try {
        const superAdminDetails = await collections.UserModel.findOne({ user_id: data.body.user_id }, { _id: 0, client_id: 1 })

        if (superAdminDetails != null && data.body.role_name === role.superAdmin) {

            const clientDetails = await collections.HospitalClientModel.findOne({ client_id: superAdminDetails.client_id })

            // checking whether the given scan type is exists
            if (!clientDetails['scan_type'].includes(data.body.scan_type)) {
                throw returnStatement(false, "scan type is not found")
            }
            else {
                // deleting new scan_type with an existing scan types
                await collections.HospitalClientModel.findOneAndUpdate(
                    { client_id: superAdminDetails.client_id },
                    { $pull: { scan_type: data.body.scan_type } },
                    { new: true }
                )
                return returnStatement(true, "scan type is deleted")
            }
        }
        else {
            throw returnStatement(false,
                superAdminDetails == null ? "used id is not found" :
                    `${data.body.role_name} user cannot able to  delete existing scan type`)
        }
    }
    catch (error) {
        // error.message is "user id is not found"
        if (error.status == false && error.message != null) {
            throw error.message
        }
        else { throw  error._message ?  error._message : "internal server error" }
    }
}

const addNewDepartmentApi = async (data) => {
    try {
        const superAdminDetails = await collections.UserModel.findOne({ user_id: data.body.user_id }, { _id: 0, client_id: 1 })

        if (superAdminDetails != null && data.body.role_name === role.superAdmin) {

            const clientDetails = await collections.HospitalClientModel.findOne({ client_id: superAdminDetails.client_id })

            if (clientDetails['department'].includes(data.body.department)) {
                throw returnStatement(false, "given department is already exist")
            }
            else {
                // adding new scan_type with an existing scan types
                await collections.HospitalClientModel.findOneAndUpdate(
                    { client_id: superAdminDetails.client_id },
                    { $push: { department: data.body.department } },
                    { new: true }
                )
                return returnStatement(true, "department is added")
            }
        }
        else {
            throw returnStatement(false,
                superAdminDetails == null ? "used id is not found" :
                    `${data.body.role_name} user cannot add department`)
        }
    }
    catch (error) {
        if (error.status == false && error.message != null) { throw error.message }
        else { throw  error._message ?  error._message : "internal server error" }
    }
}
const deleteDepartmentApi = async (data) => {
    try {
        const superAdminDetails = await collections.UserModel.findOne({ user_id: data.body.user_id }, { _id: 0, client_id: 1 })

        if (superAdminDetails != null && data.body.role_name === role.superAdmin) {

            const clientDetails = await collections.HospitalClientModel.findOne({ client_id: superAdminDetails.client_id })

            // checking whether the given department is exists
            if (!clientDetails['department'].includes(data.body.department)) {
                throw returnStatement(false, "department is not found")
            }
            else {
                // deleting new scan_type with an existing scan types
                await collections.HospitalClientModel.findOneAndUpdate(
                    { client_id: superAdminDetails.client_id },
                    { $pull: { department: data.body.department } },
                    { new: true }
                )
                return returnStatement(true, "department is deleted")
            }
        }
        else {
            throw returnStatement(false,
                superAdminDetails == null ? "used id is not found" :
                    `${data.body.role_name} user cannot able to  delete existing department`)
        }
    }
    catch (error) {
        // error.message is "user id is not found"
        if (error.status == false && error.message != null) {
            throw error.message
        }
        else { throw  error._message ?  error._message : "internal server error" }
    }
}

export default {
    createNewAdminApi, createNewHealthCenterApi, createNewRobotApi,
    addNewScanApi, deleteScanApi, addNewDepartmentApi, deleteDepartmentApi
}
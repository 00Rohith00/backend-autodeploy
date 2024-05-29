import { collections, rollBack } from "../../mongoose/index.mongoose.js"
import { roleId, role } from "../../config/config.js"
import { returnStatement } from "../../utils/return.handler.js"

/**
 * Developer creates a new client in the HospitalClientModel collection. This function takes in an object 
 * containing details of the client to be created, including the hospital name, logo URL, domain URL, and scan type. 
 * It then creates a new client entry in the database. If successful, it resolves to an object with a boolean status 
 * indicating success or failure, along with a corresponding message. If the client is successfully created, the status
 * is true, and the message is "Hospital client is created". If any error occurs during the process, it throws an Error 
 * with the message "Internal server error".
 * 
 * Additional Notes:
 * This office module, responsible for creating new clients in the HospitalClientModel collection, 
 * has been developed by our development team and is managed by our dedicated support team.
 * 
 * @param {Object} data - An object containing the details of the client to be created.
 * @param {string} data.body.hospital_name - The name of the hospital.
 * @param {string} data.body.logo_url - The URL of the hospital's logo.
 * @param {string} data.body.domain_url - The domain URL of the hospital.
 * @param {string} data.body.scan_type - The type of scan associated with the hospital.
 * 
 * @return {Promise<Object>} A Promise that resolves to an object with a boolean status and a message.
 * If the client is successfully created, the status is true and the message is "Hospital client is created".
 * Otherwise, the status is false and the message is "Internal server error".
 * @throws {Error} If the client is not created, an empty error is thrown.
 */

const createNewClientApi = async (data) => {

    try {
        const clientDetails = {
            hospital_name: data.body.hospital_name,
            logo_url: data.body.logo_url,
            domain_url: data.body.domain_url
        }

        if (data.body.scan_type != null) clientDetails.scan_type = data.body.scan_type 
        if (data.body.department != null) clientDetails.department = data.body.department 

        const isExistingHospitalName = await collections.HospitalClientModel.findOne({ hospital_name: data.body.hospital_name })

        if (isExistingHospitalName == null) {
            const createNewClient = await collections.HospitalClientModel.create(clientDetails)

            if (createNewClient._id) { return returnStatement(true, "hospital client is created") }

            else {
                // once the code is entered into this else part, which indicates the client is not created
                // and also can't able to find the exact reason for that
                // so just throwing an empty error to catch part to make this api as "FALSE" status with the message of "INTERNAL SERVER ERROR"
                throw error
            }
        }
        else { throw returnStatement(false, 'hospital name is already exist') }
    }
    catch (error) {     
        if (error.status == false && error.message != null) { throw error.message }
        else { throw  error._message ?  error._message : "internal server error" }
    }
}

/**
 * Developer creates a new super admin API. This function takes in data containing details of the super admin such as 
 * client ID, name, email, contact number, location, pin code, and image URL. It then validates the provided data
 * and creates a new super admin in the system. If successful, it returns a Promise that resolves to an object containing 
 * the status and a message. If the super admin creation fails, it throws an Error. 
 * 
 * Additional Notes:
 * This office module, responsible for creating new super admin in the User collection,  
 * has been developed by our development team and is managed by our dedicated support team.
 *
 * @param {Object} data - An object containing the details of the super admin.
 * @param {string} data.body.client_id - The client ID of the hospital.
 * @param {string} data.body.user_name - The name of the super admin.
 * @param {string} data.body.user_email_id - The email ID of the super admin.
 * @param {string} data.body.user_contact_number - The contact number of the super admin.
 * @param {string} data.body.user_location - The location of the super admin.
 * @param {string} data.body.user_pin_code - The pin code of the super admin.
 * @param {string} data.body.image_url - The URL of the image of the super admin.
 * 
 * @return {Promise<Object>} - A promise that resolves to an object with the status and message.
 * 
 * @throws {Error} - Throws an Error if the super admin creation fails.
 */

const createNewSuperAdminApi = async (data) => {

    const superAdminRollBackParams = {}
    try {

        const [clientDetails, isExistingEmailId] = await Promise.all([
            collections.HospitalClientModel.findOne({ client_id: data.body.client_id }),
            collections.UserDetailModel.findOne({ user_email_id: data.body.user_email_id })
        ])

        if (clientDetails != null && isExistingEmailId == null) {

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
            // inserting the super admin's personal details in user_details collection
            const userDetailsCollection = await collections.UserDetailModel.create(personalDetails)

            if (userDetailsCollection._id) {

                // once the details are inserted into user_details the obj id of that record [row] is stored in the superAdminRollBackParams object
                superAdminRollBackParams.UserDetailModel = userDetailsCollection._id

                // inserting the super admin's role details in user_role collection
                const userRolesCollection = await collections.UserRoleModel
                    .create({ role_id: roleId.superAdmin, role_name: role.superAdmin })

                if (userRolesCollection._id) {

                    // once the details are inserted into user_roles the obj id of that record [row] is stored in the superAdminRollBackParams object
                    superAdminRollBackParams.UserRoleModel = userRolesCollection._id

                    // inserting the super admin's login details in user_login collection
                    const userLoginCollection = await collections.UserLoginModel.create({ update_count: 0 })

                    if (userLoginCollection._id) {

                        // once the details are inserted into user_login the obj id of that record [row] is stored in the superAdminRollBackParams object
                        superAdminRollBackParams.UserLoginModel = userLoginCollection._id

                        const allDetails = {
                            client_id: data.body.client_id,
                            branch_id: null,
                            user_details: userDetailsCollection._id,
                            user_roles: userRolesCollection._id,
                            user_login: userLoginCollection._id,
                            image_url: data.body.image_url,
                            is_archive: false,
                            created_by: null,
                        }

                        // inserting the super admin's user details in users collection
                        const userCollection = await collections.UserModel.create(allDetails)

                        if (userCollection._id) {
                            return returnStatement(true, "super admin is created")
                        }
                        else {
                            // once the code is entered into this else part, which indicates the user is not created
                            // and also can't able to find the exact reason for that
                            // so just throwing an empty error to catch part to make this api as "FALSE" status with the message of "INTERNAL SERVER ERROR"
                            throw error
                        }
                    }
                    else { throw error }
                }
                else { throw error }
            }
            else { throw error }
        }
        else {
            throw returnStatement(false, clientDetails == null ? "client id is not found" : "email id is already exists")
        }
    }
    catch (error) {
        rollBack(superAdminRollBackParams)
        if (error.status == false && error.message != null) { throw error.message }
        else { throw  error._message ?  error._message : "internal server error" }
    }
}


export default { createNewClientApi, createNewSuperAdminApi }



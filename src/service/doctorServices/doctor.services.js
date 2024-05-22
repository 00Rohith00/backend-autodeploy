import { collections } from "../../mongoose/index.mongoose.js"
import { role } from "../../config/config.js"
import { returnStatement } from "../../utils/return.handler.js"


/**
 * Admin retrieves a list of doctors based on certain user roles and conditions. 
 * This function takes in a data object containing user information such as user ID, role name, and client ID. 
 * It then retrieves a list of doctors based on specific user roles and conditions.
 * The function returns a Promise that resolves to an object containing the list of doctors.
 * If the user details are not found or the user does not have the required role, it throws an Error.
 *
 * @param {Object} data - The data object containing user information.
 * @param {string} data.body.user_id - The ID of the user.
 * @param {string} data.body.role_name - The role name of the user.
 * @param {string} data.body.client_id - The ID of the client.
 * @return {Promise<Object>} A promise that resolves to an object containing the list of doctors.
 * @throws {Error} If the user details are not found or the user does not have the required role.
 * 
 */
const listOfDoctorsApi = async (data) => {
    try {

        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id }, { _id: 0, client_id: 1 })

        if (userDetails != null && (data.body.role_name === role.admin || data.body.role_name === role.systemAdmin)) {

            const listOfUser = await collections.UserModel.find({
                client_id: userDetails.client_id,
                created_by: { $ne: null },
                branch_id: null
            }, { _id: 0, user_id: 1 })
                .populate({
                    path: 'user_details',
                    select: 'user_contact_number user_name -_id',
                    populate: {
                        path: 'doctor',
                        select: '-_id doctor_department'
                    }
                })

            let listOfDoctors = []

            listOfUser.forEach((user) => {

                if (user.user_details.doctor != null) {
                    listOfDoctors.push({
                        doctor_id: user.user_id,
                        doctor_name: user.user_details.user_name,
                        department: user.user_details.doctor.doctor_department,
                        mobile_number: user.user_details.user_contact_number,
                    })
                }
            })
            return returnStatement(true, "list of doctors", listOfDoctors)
        }
        else {
            throw returnStatement(false,
                userDetails == null ? "used id is not found" :
                    `${data.body.role_name} user cannot able to view list of doctors`)
        }
    }
    catch (error) {
        if (error.status == false && error.message != null) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}

const doctorDetailsApi = async (data) => {

    try {

        const [userDetails, doctorDetails] = await Promise.all([
            await collections.UserModel.findOne({ user_id: data.body.user_id }, { _id: 0, client_id: 1 }),
            await collections.UserModel.findOne({ user_id: data.body.doctor_id }, { _id: 0, client_id: 1, image_url: 1 })
                .populate({
                    path: 'user_details',
                    select: 'user_name user_email_id user_contact_number user_age user_gender -_id user_location',
                    populate: {
                        path: 'doctor',
                        select: '-_id doctor_department doctor_registration_id mbbs_completed_year time_from time_to'
                    }
                })
        ])

        if (userDetails != null && doctorDetails != null && (data.body.role_name === role.admin || data.body.role_name === role.systemAdmin)) {

            if (userDetails.client_id != doctorDetails.client_id || doctorDetails.user_details.doctor == null ) {
                throw returnStatement(false, "doctor id not found")
            }

            const clientDetails = await collections.HospitalClientModel.findOne({ client_id: userDetails.client_id }, {_id:0, hospital_name: 1})
            const details = {
                doctor_id: data.body.doctor_id,
                doctor_name: doctorDetails.user_details.user_name,
                email_id: doctorDetails.user_details.user_email_id,
                mobile_number: doctorDetails.user_details.user_contact_number,
                age: doctorDetails.user_details.user_age,
                gender: doctorDetails.user_details.user_gender,
                hospital_name: clientDetails.hospital_name,
                location: doctorDetails.user_details.user_location,
                image_url: doctorDetails.image_url,
                ...doctorDetails.user_details.doctor._doc
            }

            return returnStatement(true, "doctor details", details)
        }
        else {
            throw returnStatement(false,
                userDetails == null ? "used id is not found" :
                    doctorDetails == null ? "doctor id is not found" :
                        `${data.body.role_name} user cannot able to view doctor details`)
        }
    }
    catch (error) {
        if (error.status == false && error.message != null) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}

const listOfDepartmentsApi = async (data) => {
    try {

        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id }, { _id: 0, client_id: 1 })

        if (userDetails != null && (data.body.role_name === role.admin || data.body.role_name === role.systemAdmin)) {

            const listOfDepartments = await collections.HospitalClientModel.findOne({ client_id: userDetails.client_id }, { _id: 0, department: 1 })

            return returnStatement(true, `list of hospital departments`, listOfDepartments.department)

        }
        else {
            throw returnStatement(false,
                userDetails == null ? "used id is not found" :
                    `${data.body.role_name} user cannot able to view list of hospital departments`)
        }
    }
    catch (error) {
        if (error.status == false && error.message != null) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}

const editDoctorDetailsApi = async (data) => { }

export default { listOfDoctorsApi, doctorDetailsApi, editDoctorDetailsApi, listOfDepartmentsApi }

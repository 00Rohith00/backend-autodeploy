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

        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id, is_archive: false }, { _id: 0, client_id: 1 })

        if (userDetails && (data.body.role_name === role.admin || data.body.role_name === role.systemAdmin)) {

            const clientDetails = await collections.HospitalClientModel.findOne({ client_id: userDetails.client_id })

            const listOfUser = await collections.UserModel.find({
                client_id: userDetails.client_id,
                created_by: { $ne: null },
                branch_id: null,
                is_archive: false
            }, { _id: 0, user_id: 1 })
                .populate({
                    path: 'user_details',
                    select: 'user_contact_number user_name -_id',
                    populate: {
                        path: 'doctor',
                        select: '-_id department_id'
                    }
                })

            let listOfDoctors = []

            listOfUser.forEach((user) => {

                if (user.user_details.doctor) {

                    var departmentName = ""

                    clientDetails['department'].forEach((department) => {
                        if (department.id == user.user_details.doctor.department_id) departmentName = department.department
                    })

                    listOfDoctors.push({
                        doctor_id: user.user_id,
                        doctor_name: user.user_details.user_name,
                        department: departmentName,
                        mobile_number: user.user_details.user_contact_number,
                    })
                }
            })
            return returnStatement(true, "list of doctors", listOfDoctors)
        }
        else {
            throw returnStatement(false,
                !userDetails ? "used id is not found" :
                    `${data.body.role_name} can't able to view list of doctors`)
        }
    }
    catch (error) {
        if (error.status == false && error.message) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}
/**
 * Admin retrieves detailed information about a doctor based on certain user roles and conditions.
 * This function takes in a data object containing user information such as user ID, doctor ID, and role name.
 * It then retrieves the doctor details, including user and doctor-specific information.
 * The function returns a Promise that resolves to an object containing the doctor details.
 * If the user details or doctor details are not found, or the user does not have the required role, it throws an Error.
 *
 * @param {Object} data - The input data for the API.
 * @param {Object} data.body - The body of the input data.
 * @param {string} data.body.user_id - The ID of the user making the request.
 * @param {string} data.body.doctor_id - The ID of the doctor whose details are being requested.
 * @param {string} data.body.role_name - The role of the user making the request (e.g., admin, systemAdmin).
 * 
 * @throws Will throw an error if user details or doctor details are not found, or if the user does not have the correct role to 
 * view doctor details.
 * @throws Will throw an error if there is an internal server error.
 *
 * @returns {Promise<Object>} - Returns a promise that resolves to an object containing doctor details if successful.
 **/
const doctorDetailsApi = async (data) => {

    try {

        const [userDetails, doctorDetails] = await Promise.all([
            collections.UserModel.findOne({ user_id: data.body.user_id, is_archive: false }, { _id: 0, client_id: 1 }),
            collections.UserModel.findOne({ user_id: data.body.doctor_id, is_archive: false }, { _id: 0, client_id: 1, image_url: 1 })
                .populate({
                    path: 'user_details',
                    select: 'user_name user_email_id user_contact_number user_age user_gender -_id user_location user_pin_code',
                    populate: {
                        path: 'doctor',
                        select: '-_id department_id doctor_registration_id mbbs_completed_year time_from time_to'
                    }
                })
        ])

        if (userDetails && doctorDetails && (data.body.role_name === role.admin || data.body.role_name === role.systemAdmin)) {

            if (userDetails.client_id != doctorDetails.client_id || !doctorDetails.user_details.doctor)
                throw returnStatement(false, "doctor id not found")

            const clientDetails = await collections.HospitalClientModel.findOne({ client_id: userDetails.client_id })
            const details = {
                doctor_id: data.body.doctor_id,
                doctor_name: doctorDetails.user_details.user_name,
                email_id: doctorDetails.user_details.user_email_id,
                mobile_number: doctorDetails.user_details.user_contact_number,
                age: doctorDetails.user_details.user_age,
                gender: doctorDetails.user_details.user_gender,
                hospital_name: clientDetails.hospital_name,
                location: doctorDetails.user_details.user_location,
                pin_code: doctorDetails.user_details.user_pin_code,
                image_url: doctorDetails.image_url,
                ...doctorDetails.user_details.doctor._doc
            }

            clientDetails['department'].forEach((department) => {
                if (department.id == details.department_id) details.doctor_department = department.department
            })
            return returnStatement(true, "doctor details", details)
        }
        else {
            throw returnStatement(false,
                !userDetails ? "used id is not found" :
                    !doctorDetails ? "doctor id is not found" :
                        `${data.body.role_name} can't able to view doctor details`)
        }
    }
    catch (error) {
        if (error.status == false && error.message) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}

/**
 * Admin retrieves a list of hospital departments based on user roles and conditions.
 * This function takes in a data object containing user information such as user ID and role name.
 * It then retrieves the list of departments from the hospital client associated with the user.
 * The function returns a Promise that resolves to an object containing the list of departments.
 * If the user details are not found or the user does not have the required role, it throws an Error.
 *
 * @param {Object} data - The data object containing user information.
 * @param {Object} data.body - The body of the input data.
 * @param {string} data.body.user_id - The ID of the user making the request.
 * @param {string} data.body.role_name - The role name of the user making the request (e.g., admin, systemAdmin).
 * @return {Promise<Object>} A promise that resolves to an object containing the list of hospital departments.
 * @throws {Error} If the user details are not found or the user does not have the required role.
 **/
const listOfDepartmentsApi = async (data) => {
    try {

        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id, is_archive: false }, { _id: 0, client_id: 1 })

        if (userDetails && (data.body.role_name === role.admin || data.body.role_name === role.systemAdmin)) {

            const clientDetails = await collections.HospitalClientModel.findOne({ client_id: userDetails.client_id }, { _id: 0, department: 1 })

            let listOfDepartments = []

            clientDetails['department'].forEach((department) => {
                if (department.is_archive == false)
                    listOfDepartments.push({ id: department.id, department: department.department })
            })

            return returnStatement(true, `list of hospital departments`, listOfDepartments)
        }
        else {
            throw returnStatement(false,
                !userDetails ? "used id is not found" :
                    `${data.body.role_name} can't able to view list of hospital departments`)
        }
    }
    catch (error) {
        if (error.status == false && error.message) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}

/** 
 * Admin edits the details of a doctor based on specific conditions. This function takes in a data object containing 
 * user and doctor information, including IDs, role name, and updated details. It then updates the doctor's details 
 * if the conditions are met. The function returns a Promise that resolves to a success message if the update is successful.
 * If the user or doctor details are not found, or the user does not have the required role, it throws an Error.
 *
 * @param {Object} data - The data object containing user and doctor information.
 * @param {Object} data.body - The body of the input data.
 * 
 * @param {string} data.body.user_id - The ID of the user making the request.
 * @param {string} data.body.user_name - The updated name of the doctor.
 * @param {number} data.body.user_age - The updated age of the doctor.
 * @param {string} data.body.user_gender - The updated gender of the doctor.
 * @param {string} data.body.user_email_id - The updated email ID of the doctor.
 * @param {string} data.body.user_location - The updated location of the doctor.
 * @param {string} data.body.user_pin_code - The updated pin code of the doctor.
 * @param {string} data.body.user_contact_number - The updated contact number of the doctor.
 * 
 * @param {string} data.body.doctor_id - The ID of the doctor whose details are being edited.
 * @param {string} data.body.image_url - The updated image URL of the doctor.
 * @param {string} data.body.doctor_registration_id - The updated registration ID of the doctor.
 * @param {number} data.body.mbbs_completed_year - The updated year of MBBS completion of the doctor.
 * @param {string} data.body.department_id - The updated department ID of the doctor.
 * @param {string} [data.body.time_from] - The updated start time of the doctor's availability.
 * @param {string} [data.body.time_to] - The updated end time of the doctor's availability.
 * @param {string} data.body.role_name - The role name of the user making the request (e.g., admin).
 * 
 * @return {Promise<Object>} A promise that resolves to a success message if the update is successful.
 * @throws {Error} If the user or doctor details are not found, or the user does not have the required role.
 **/
const editDoctorDetailsApi = async (data) => {

    try {

        const [userDetails, doctor] = await Promise.all([
            collections.UserModel.findOne({ user_id: data.body.user_id, is_archive: false }, { _id: 0, client_id: 1 }),
            collections.UserModel.findOne({ user_id: data.body.doctor_id, is_archive: false }, { _id: 0, client_id: 1, image_url: 1 })
                .populate({
                    path: 'user_details',
                    select: 'user_name user_email_id user_contact_number user_age user_gender -_id user_location',
                    populate: {
                        path: 'doctor',
                        select: '-_id department_id doctor_registration_id mbbs_completed_year time_from time_to'
                    }
                })
        ])

        if (userDetails && doctor && (data.body.role_name === role.admin)) {

            if (userDetails.client_id != doctor.client_id || !doctor.user_details.doctor) throw returnStatement(false, "doctor id not found")

            if (doctor.user_details.user_email_id != data.body.user_email_id) {
                const isExisting = await collections.UserDetailModel.findOne({ user_email_id: data.body.user_email_id })
                if (isExisting) throw returnStatement(false, "email id already exists")
            }

            if (doctor.user_details.doctor.doctor_registration_id != data.body.doctor_registration_id) {
                const isExisting = await collections.DoctorModel.findOne({ doctor_registration_id: data.body.doctor_registration_id })
                if (isExisting) throw returnStatement(false, "doctor registration id is already exists")
            }

            const client = await collections.HospitalClientModel.findOne({ client_id: userDetails.client_id })

            let isValidDepartment = false

            client['department'].forEach((department) => {
                if (department.id == data.body.department_id && department.is_archive == false) isValidDepartment = true
            })

            if (!isValidDepartment) throw returnStatement(false, "department id not found")

            const doctorParams = {
                doctor_registration_id: data.body.doctor_registration_id,
                mbbs_completed_year: data.body.mbbs_completed_year,
                department_id: data.body.department_id,
            }

            if (data.body.time_from) doctorParams.time_from = data.body.time_from
            if (data.body.time_to) doctorParams.time_to = data.body.time_to

            const userDetailsParams = {
                user_name: data.body.user_name,
                user_email_id: data.body.user_email_id,
                user_contact_number: data.body.user_contact_number,
                user_location: data.body.user_location,
                user_pin_code: data.body.user_pin_code,
                user_age: data.body.user_age,
                user_gender: data.body.user_gender,
            }

            await Promise.all([
                collections.DoctorModel.findOneAndUpdate({ doctor_registration_id: doctor.user_details.doctor.doctor_registration_id },
                    { $set: doctorParams },
                    { new: true }),

                collections.UserDetailModel.findOneAndUpdate({ user_email_id: doctor.user_details.user_email_id },
                    { $set: userDetailsParams },
                    { new: true }),

                collections.UserModel.findOneAndUpdate({ user_id: data.body.doctor_id },
                    { $set: { image_url: data.body.image_url } },
                    { new: true }),
            ])

            return returnStatement(true, "doctor's detail is updated")
        }
        else {
            throw returnStatement(false,
                !userDetails ? "used id is not found" :
                    !doctor ? "doctor id is not found" :
                        `${data.body.role_name} can't able to edit doctor details`)
        }
    }
    catch (error) {
        if (error.status == false && error.message) { throw error.message }
        else { throw "internal server error" }
    }

}



export default {
    listOfDoctorsApi, doctorDetailsApi,
    editDoctorDetailsApi, listOfDepartmentsApi
}

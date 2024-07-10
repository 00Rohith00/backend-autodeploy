import { collections } from "../../mongoose/index.mongoose.js"
import { role } from "../../config/config.js"
import { returnStatement } from "../../utils/return.handler.js"

/**
 * Admin creates a new patient in the database with the given data. This function takes in data for creating a new patient, 
 * including the ID and role name of the user creating the patient, patient's mobile number, name, email ID (optional),
 * gender, age, pin code, electronic ID (optional), and OP ID (optional). It returns a Promise that resolves to an object 
 * containing the status and message of the operation. If an error occurs during the operation, it throws an error message.
 *
 * @function createNewPatientsApi
 * @param {Object} data - The data for creating the new patient.
 * @param {string} data.body.user_id - The ID of the user creating the patient.
 * @param {string} data.body.role_name - The role of the user creating the patient.
 * 
 * @param {string} data.body.patient_mobile_number - The mobile number of the patient.
 * @param {string} data.body.patient_name - The name of the patient.
 * @param {string|null} [data.body.patient_email_id] - The email ID of the patient (optional).
 * 
 * @param {string} data.body.patient_gender - The gender of the patient.
 * @param {number} data.body.patient_age - The age of the patient.
 * @param {string} data.body.patient_pin_code - The pin code of the patient.
 * @param {string|null} [data.body.electronic_id] - The electronic ID of the patient (optional).
 * 
 * @param {string|null} [data.body.op_id] - The OP ID of the patient (optional).
 * @return {Promise<Object>} - A promise that resolves to an object containing the status and message of the operation.
 * @throws {string} - If an error occurs during the operation.
 */
const createNewPatientsApi = async (data) => {

    try {
        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id }, { _id: 0, client_id: 1 })

        if (userDetails && (data.body.role_name === role.admin || data.body.role_name === role.systemAdmin)) {

            const patientDetails = {
                client_id: userDetails.client_id,
                patient_mobile_number: data.body.patient_mobile_number,
                patient_name: data.body.patient_name,
                patient_gender: data.body.patient_gender,
                patient_age: data.body.patient_age,
                patient_pin_code: data.body.patient_pin_code,
                action_required: false,
                created_by: data.body.user_id
            }

            if (data.body.electronic_id) patientDetails.electronic_id = data.body.electronic_id
            if (data.body.patient_address) patientDetails.patient_address = data.body.patient_address
            if (data.body.patient_email_id) patientDetails.patient_email_id = data.body.patient_email_id

            if (data.body.op_id) {

                const patientDetail = await collections.PatientModel.findOne({ op_id: data.body.op_id, client_id: userDetails.client_id })
                if (patientDetail) {
                    throw returnStatement(false, "OP-ID is duplicate")
                }
                patientDetails.op_id = data.body.op_id
            }

            const patientDetailsCollection = await collections.PatientModel.create(patientDetails)

            if (patientDetailsCollection._id) { return returnStatement(true, "patient is created") }
            else { throw error }
        }
        else {
            throw returnStatement(false,
                !userDetails ? "used id is not found" :
                    `${data.body.role_name} can't able to create new patient`)
        }
    }
    catch (error) {
        if (error.status == false && error.message) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}


/**
 * Admin retrieves a list of patients associated with the user and role specified in the data object. 
 * This function takes in data containing user ID, role name, and optional parameters. 
 * It retrieves the list of patients based on the provided user ID and role name. If successful,
 * it returns a Promise that resolves to an object containing the status, message, and a list of patients.
 * If the user details are not found or the user does not have permission to access the list of patients, 
 * an object with status and message properties is thrown. If an internal server error occurs, a string with 
 * the error message is thrown.
 *
 * @function listOfPatientsApi
 * @param {Object} data - An object containing the user ID, role name, and other optional parameters.
 * @param {string} data.body.user_id - The ID of the user.
 * @param {string} data.body.role_name - The role of the user.
 * @return {Promise<Object>} - A promise that resolves to an object containing the status, message, and list of patients.
 * @throws {Object} - If the user details are not found or the user does not have permission to access the list of patients, an object with status and message properties is thrown.
 * @throws {string} - If an internal server error occurs, a string with the error message is thrown.
 */
const listOfPatientsApi = async (data) => {

    try {
        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id }, { _id: 0, client_id: 1 })

        if (userDetails && (data.body.role_name === role.admin || data.body.role_name === role.systemAdmin)) {

            const listOfPatients = await collections.PatientModel.find(
                { client_id: userDetails.client_id },
                {
                    patient_id: 1, patient_name: 1, patient_email_id: 1, patient_mobile_number: 1, _id: 0,
                    patient_gender: 1, patient_age: 1, electronic_id: 1, patient_pin_code: 1, patient_address: 1, op_id: 1
                }
            )
            return returnStatement(true, "list of patients", listOfPatients)
        }
        else {
            throw returnStatement(false,
                !userDetails ? "used id is not found" :
                    `${data.body.role_name} can't able to access list of patients details`)
        }
    }
    catch (error) {
        if (error.status == false && error.message) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}

/**
 * Admin edits the patient details in the database based on the provided data. 
 * This function takes in a data object containing the user ID, role name, patient ID, and the updated 
 * patient details. It updates the patient details in the database if the user has the necessary permissions. 
 * If successful, it returns a Promise that resolves to an object containing the status and message of the operation.
 * If the user details are not found or the user does not have permission to edit the patient details, an object with 
 * status and message properties is thrown. If an internal server error occurs, a string with the error message is thrown.
 *
 * @function editPatientDetailsApi
 * @param {Object} data - The data object containing the user ID, role name, and patient ID.
 * @param {string} data.body.user_id - The ID of the user.
 * @param {string} data.body.role_name - The role of the user.
 * @param {string} data.body.patient_id - The ID of the patient.
 * @param {Object} data.body.edit - The object containing the updated patient details.
 * 
 * @return {Promise<Object>} - A promise that resolves to an object containing the status and message of the operation.
 * @throws {Object} - If the user details are not found or the user does not have permission to edit the patient details, an object with status and message properties is thrown.
 * @throws {string} - If an internal server error occurs, a string with the error message is thrown.
 */
const editPatientDetailsApi = async (data) => {
    try {
        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id }, { _id: 0, client_id: 1 })

        const patient = await collections.PatientModel.findOne({ patient_id: data.body.patient_id, client_id: userDetails.client_id })

        if (userDetails && patient && (data.body.role_name === role.admin || data.body.role_name === role.systemAdmin)) {


            const patientDetails = {
                patient_mobile_number: data.body.patient_mobile_number,
                patient_name: data.body.patient_name,
                patient_gender: data.body.patient_gender,
                patient_age: data.body.patient_age,
                patient_pin_code: data.body.patient_pin_code
            }

            if (data.body.electronic_id) patientDetails.electronic_id = data.body.electronic_id
            if (data.body.patient_address) patientDetails.patient_address = data.body.patient_address
            if (data.body.patient_email_id) patientDetails.patient_email_id = data.body.patient_email_id

            if (data.body.op_id) {

                if ((!patient.op_id || patient.op_id != data.body.op_id)) {

                    const patientDetail = await collections.PatientModel.findOne({ op_id: data.body.op_id, client_id: userDetails.client_id })
                    if (patientDetail) throw returnStatement(false, "OP-ID is duplicate")
                    patientDetails.op_id = data.body.op_id
                }
            }

            await collections.PatientModel.findOneAndUpdate({ patient_id: data.body.patient_id },
                { $set: patientDetails },
                { new: true })

            return returnStatement(true, "patient details are updated")
        }
        else {
            throw returnStatement(false,
                !userDetails ? "used id is not found" :
                    !patient ? "patient id is not found" :
                        `${data.body.role_name} can't able to edit patients details`)
        }
    }
    catch (error) {
        if (error.status == false && error.message) { throw error.message }
        else { throw "internal server error" }
    }
}


const previousHistoryApi = async (data) => { }

export default {
    createNewPatientsApi, listOfPatientsApi,
    previousHistoryApi, editPatientDetailsApi
}
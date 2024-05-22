import { collections } from "../../mongoose/index.mongoose.js"
import { videoCallApi } from "../microServices/videoCall.js"
import { role } from "../../config/config.js"
import { returnStatement } from "../../utils/return.handler.js"

/**
 * Admin retrieves patient information from the database based on the provided data. This function takes in a data object containing 
 * the user ID, client ID, and patient mobile number. It queries the database to find patient details associated with the provided 
 * user ID, client ID, and patient mobile number. If successful, it returns a Promise that resolves to an object containing the
 * status, message, and a list of patient details. If the user details or user ID are not found, it throws an object with status 
 * and message properties. If an internal server error occurs during the process, it throws a string with the error message.
 *
 * 
 * @param {Object} data - The data object containing the user ID, client ID, and patient mobile number.
 * @param {string} data.body.user_id - The ID of the user.
 * @param {string} data.body.client_id - The ID of the client.
 * @param {string} data.body.patient_mobile_number - The mobile number of the patient.
 * 
 * @return {Promise<Object>} - A promise that resolves to an object containing the status, message, and list of patient details.
 * @throws {Object} - If the user details are not found or the user ID is not found, an object with status and message properties is thrown.
 * @throws {string} - If an internal server error occurs, a string with the error message is thrown.
 */
const searchPatientInformationApi = async (data) => {

    try {

        //  retrieving the user's details [admin or system_admin] using user_id 
        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id })

        if (userDetails != null) {

            // retrieving the required patient details in patient collection 
            // 1 --> field is required and
            // 0 --> field is not required 
            const patientInformation = await collections.PatientModel
                .find({ client_id: data.body.client_id, patient_mobile_number: data.body.patient_mobile_number },
                    {
                        patient_id: 1, patient_name: 1, patient_gender: 1,
                        patient_age: 1, patient_email_id: 1, patient_mobile_number: 1,
                        electronic_id: 1, _id: 0
                    })

            return returnStatement(true, "list of patient's details ", patientInformation)
        }
        else { throw returnStatement(false, "user id not found") }
    }
    catch (error) {
        if (error.status == false && error.message != null) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}

/**
 * Admin retrieves a list of robots associated with a hospital branch. This function takes in a data object containing 
 * the user ID, branch ID, and role name. It then retrieves the list of robots associated with the specified branch.
 * If successful, it returns a Promise that resolves to an object containing the list of robots.
 * If any error occurs during the process, it throws an Error with details of the specific error encountered.
 *
 * @param {Object} data - The data object containing the user ID, branch ID, and role name.
 * @param {string} data.body.user_id - The ID of the user making the request.
 * @param {string} data.body.branch_id - The ID of the branch associated with the robots.
 * @param {string} data.body.role_name - The role name of the user making the request.
 * @return {Promise<Object>} A promise that resolves to an object containing the list of robots.
 * 
 * @throws {Error} If the user ID is not found, the branch ID is not found, or the user does not have the required role.
 * @throws {Error} If an error occurs while retrieving the user or branch details.
 * @throws {Error} If an error occurs while retrieving the list of robots.
 * @throws {Error} If an error occurs while constructing the return statement.
 * @throws {Error} If an error occurs while handling the error.
 */
const listOfHospitalRobotsApi = async (data) => {

    try {

        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id })

        // retrieving branch's detail using branch_id in health center collection
        const branchDetails = await collections.HealthCenterModel.findOne({ branch_id: data.body.branch_id, client_id: userDetails.client_id })

        if (branchDetails != null &&
            userDetails != null &&
            (data.body.role_name === role.systemAdmin || data.body.role_name === role.admin)) {

            // retrieving all the robot's id using branch_id
            const listOfRobots = await collections.RobotModel
                .find({ branch_id: data.body.branch_id },
                    { robot_id: 1, robot_registration_id: 1, _id: 0 })

            return returnStatement(true, "list of robots", listOfRobots)
        }
        else {
            throw returnStatement(false,
                userDetails == null ? "used id is not found" :
                    branchDetails == null ? "branch id is not found" :
                        `${data.body.role_name} user can't able to access this api`)
        }
    }
    catch (error) {
        if (error.status == false && error.message != null) {
            // if branch id is not found then this if statement will execute
            throw error.message
        }
        else {
            // if any error occurs while inserting or retrieving a data we can find that using error._message [in build property]
            // if we got some other error just returning a internal server error to the front end.
            throw error._message ? error._message : "internal server error"
        }
    }
}

/**
 * Admin retrieves a list of health centers associated with a client. This function takes in data containing the user ID, client ID, 
 * and role name. It then verifies the user's permissions and retrieves the list of health centers associated with the client.
 * The function returns a Promise that resolves to an object containing the list of health centers.
 *
 * @param {Object} data - The data object containing the user ID, client ID, and role name.
 * @param {string} data.body.user_id - The ID of the user making the request.
 * @param {string} data.body.client_id - The ID of the client.
 * @param {string} data.body.role_name - The role name of the user making the request.
 * @return {Promise<Object>} A promise that resolves to an object containing the list of health centers.
 * 
 * @throws {Error} If the user ID is not found or the user does not have the required role, an error is thrown.
 * @throws {Error} If an error occurs while retrieving the user or health center details, an error is thrown.
 * @throws {Error} If an error occurs while constructing the return statement, an error is thrown.
 * @throws {Error} If an error occurs while handling the error, an error is thrown.
 */
const listOfHealthCenterApi = async (data) => {

    try {

        // retrieving the user's details [admin or system_admin] using user_id to find client_id
        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id })

        if (userDetails != null && (data.body.role_name === role.systemAdmin || data.body.role_name === role.admin)) {

            // getting the list of health center using client_id
            const listOfHealthCenter = await collection.HealthCenterModel
                .find({ client_id: data.body.client_id },
                    { branch_id: 1, branch_name: 1, _id: 0 })

            return returnStatement(true, "list of health centers", listOfHealthCenter)

        }
        else {
            throw returnStatement(false,
                userDetails == null ? "used id is not found" :
                    `${data.body.role_name} user can't able to access this api`)
        }
    }
    catch (error) {
        if (error.status == false && error.message != null) {
            // if user id is not found then this if statement will execute
            throw error.message
        }
        else {
            // if any error occurs while inserting or retrieving a data we can find that using error._message [in build property]
            // if we got some other error just returning a internal server error to the front end.
            throw error._message ? error._message : "internal server error"
        }
    }
}

/**
 * Admin retrieves a list of hospital doctors based on the provided user data. This function takes in user data containing 
 * the user ID and role name. It queries the database to retrieve the list of doctors associated with the hospital based
 * on the provided user data. If successful, it returns a Promise that resolves to an object containing the list of doctors. 
 * If the user details are not found or the user does not have the required role, it throws an Error.
 * 
 * @param {Object} data - The user data containing the user ID and role name.
 * @param {string} data.body.user_id - The ID of the user.
 * @param {string} data.body.role_name - The role name of the user.
 * @return {Promise<Object>} A promise that resolves to an object containing the list of doctors.
 * @throws {Error} If the user details are not found or the user does not have the required role.
 */
const listOfHospitalDoctorsApi = async (data) => {

    try {

        // retrieving the user's details [admin or system_admin] using user_id 
        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id })

        if (userDetails != null && (data.body.role_name === role.systemAdmin || data.body.role_name === role.admin)) {

            // find ( { condition } , { required field } )
            // user includes [super_admin, system_admin, doctor, admin]
            // condition --> user have given client_id, created_by is not equal to null and branch_id is equal to null
            // using client_id we get all the user's details who belongs to that client
            // but we don't want all the users only doctor user is required
            // for super admin created_by is null so to eliminate the super admin user we have used created_by not equal to null
            // to cut out system_admin we used branch_id not equal to null

            const listOfAllUser = await collections.UserModel
                .find({
                    client_id: data.body.client_id,
                    created_by: { $ne: null },                // $ne --> not equal to
                    branch_id: null
                }, {
                    user_id: 1,
                    _id: 0
                })
                .populate({
                    path: 'user_details',                    // required collection
                    match: { doctor: { $ne: null } },        // condition
                    select: '-_id user_name',                // required field
                })

            // now we have all user's [ doctor and admin] details of particular client
            let listOfDoctors = []

            // but we need only doctor so we used iteration for retrieving doctor using map()
            listOfAllUser.map((users) => {
                if (users.user_details != null) {
                    listOfDoctors.push({ doctor_id: users.user_id, doctor_name: users.user_details.user_name })
                }
            })

            return returnStatement(true, "list of doctors", listOfDoctors)

        }
        else {
            throw returnStatement(false,
                userDetails == null ? "used id is not found" :
                    `${data.body.role_name} user can't able to access this api`)
        }

    }
    catch (error) {
        if (error.status == false && error.message != null) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}


/**
 * Admin retrieves a list of scan types based on user ID and role. This function takes in the user ID and role name as parameters 
 * and fetches a list of scan types associated with the user's role.It returns a Promise that resolves to an object containing
 * the list of scan types.
 *
 * @param {string} data.body.user_id - The ID of the user.
 * @param {string} data.body.role_name - The role name of the user.
 * @return {Promise<Object>} A promise that resolves to an object containing the list of scan types.
 */
const listOfScanTypesApi = async (data) => {

    try {
        // retrieving the user's details [admin or system_admin] using user_id 
        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id })

        if (userDetails != null && (data.body.role_name === role.systemAdmin || data.body.role_name === role.admin)) {

            const listOfScanTypes = await collections.HospitalClientModel
                .findOne({ client_id: userDetails.client_id }, { scan_type: 1, _id: 0 })

            return returnStatement(true, "list of scan types", listOfScanTypes['scan_type'])
        }
        else {
            throw returnStatement(false,
                userDetails == null ? "used id is not found" :
                    `${data.body.role_name} user can't able to access this api`)
        }
    }
    catch (error) {
        if (error.status == false && error.message != null) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}


/**
 * Admin creates a new appointment based on the provided data. This function accepts a data object containing details about the 
 * appointment, including the user ID and role name of the user creating the appointment, patient information such as name, 
 * mobile number, email (optional), gender, age, pin code, electronic ID (optional), patient ID (optional), OP-ID (optional), 
 * billing ID (optional), USG reference ID (optional), doctor ID, appointment time (optional), appointment date, branch ID, robot ID,
 * scan type, and differential diagnosis. It returns a Promise that resolves to an object indicating the success of the appointment 
 * creation. If any error occurs during the creation process, it throws an Error.
 * 
 *
 * @param {Object} data - The data object containing the appointment details.
 * @param {string} data.body.user_id - The ID of the user creating the appointment.
 * @param {string} data.body.role_name - The role of the user creating the appointment.
 * 
 * @param {string} data.body.patient_mobile_number - The mobile number of the patient.
 * @param {string} data.body.patient_name - The name of the patient.
 * @param {string|null} [data.body.patient_email_id] - The email ID of the patient (optional).
 * @param {string} data.body.patient_gender - The gender of the patient.
 * @param {number} data.body.patient_age - The age of the patient.
 * @param {string} data.body.patient_pin_code - The pin code of the patient.
 * @param {string|null} [data.body.electronic_id] - The electronic ID of the patient (optional).
 * @param {string} data.body.patient_id - The ID of the patient (optional).
 * 
 * @param {string} data.body.op_id - The OP-ID of the patient (optional).
 * @param {string} data.body.billing_id - The billing ID of the patient (optional).
 * @param {string} data.body.usg_ref_id - The USG reference ID of the patient (optional).
 * 
 * @param {string} data.body.doctor_id - The ID of the doctor.
 * @param {string} [data.body.time] - The time of the appointment (optional).
 * @param {string} data.body.date - The date of the appointment.
 * 
 * @param {string} data.body.branch_id - The ID of the branch.
 * @param {string} data.body.robot_id - The ID of the robot.
 * @param {string} data.body.scan_type - The type of scan for the appointment.
 * @param {string} data.body.differential_diagnosis - The differential diagnosis for the appointment.
 * 
 * @return {Promise<Object>} A promise that resolves to an object indicating the success of the appointment creation.
 * @throws {Error} If there is an error creating the appointment.
 */
const createNewAppointmentApi = async (data) => {

    try {

        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id })

        if (userDetails != null && (data.body.role_name === role.systemAdmin || data.body.role_name === role.admin)) {

            let patientId

            const patientDetails = {
                client_id: userDetails.client_id,
                patient_mobile_number: data.body.patient_mobile_number,
                patient_name: data.body.patient_name,
                patient_email_id: data.body.patient_email_id ? data.body.patient_email_id : null,
                patient_gender: data.body.patient_gender,
                patient_age: data.body.patient_age,
                patient_pin_code: data.body.patient_pin_code,
                electronic_id: data.body.electronic_id ? data.body.electronic_id : null,
                action_required: false,
                created_by: data.body.user_id,
            }

            if (data.body.op_id) {
                const patientDetails = await collections.PatientModel.findOne({ op_id: data.body.op_id })

                if (patientDetails != null) {
                    throw returnStatement(false, "OP-ID is duplicate")
                }
                patientDetails.op_id = data.body.op_id

            }

            if (!data.body.patient_id) {
                const createPatient = await collections.PatientModel.create(patientDetails)
                if (createPatient) patientId = createPatient.patient_id
                else throw error
            }

            const doctorDetails = await collections.UserModel
                .findOne({ user_id: data.body.doctor_id }, { user_details: 1, _id: 0 })
                .populate({
                    path: 'user_details',
                    select: '-_id user_name',
                })

            if (doctorDetails == null) throw error

            const conferenceInfo = {
                owner: doctorDetails.user_details.user_name,
                appointment_date: data.body.date,
                appointment_time: data.body.time
            }

            const appointmentDetails = {
                client_id: data.body.client_id,
                op_id: data.body.op_id ? data.body.op_id : null,
                billing_id: data.body.billing_id ? data.body.billing_id : null,
                usg_ref_id: data.body.usg_ref_id ? data.body.usg_ref_id : null,
                patient_id: data.body.patient_id ? data.body.patient_id : patientId,
                doctor_id: data.body.doctor_id,
                branch_id: data.body.branch_id,
                robot_id: data.body.robot_id,
                date: data.body.date,
                time: data.body.time ? data.body.time : "00-00-00",
                scan_type: data.body.scan_type,
                differential_diagnosis: data.body.differential_diagnosis,
                appointment_status: "up_coming",
                appointment_type: "normal_appointment",
                created_by: data.body.user_id,
                is_report_sent: false,
                call_url: await videoCallApi(conferenceInfo),
                action_required: false
            }

            const createAppointment = await collections.AppointmentModel.create(appointmentDetails)

            if (createAppointment) {

                return returnStatement(true, "appointment is created on " + data.body.date)
            }
            else { throw error }

        }
        else {
            throw returnStatement(false,
                userDetails == null ? "used id is not found" :
                    `${data.body.role_name} user can't able to access this api`)
        }

    }
    catch (error) {
        if (error.status == false && error.message != null) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}

/**
 * Cancels an appointment based on the provided data. Cancels an appointment based on the provided data. 
 * This function takes in data containing user information such as user ID, role name, and appointment ID. 
 * It then validates the provided data and cancels the appointment associated with the provided ID. 
 * If successful, it returns a Promise that resolves to an object containing the status and message of the cancellation. 
 * If the user details are not found or the user ID is not found, it throws an object with status and message properties. 
 * If an internal server error occurs, it throws a string with the error message.
 *
 * @param {Object} data - The data object containing the user ID, role name, and appointment ID.
 * @param {string} data.body.user_id - The ID of the user.
 * @param {string} data.body.role_name - The role name of the user.
 * @param {string} data.body.appointment_id - The ID of the appointment to be cancelled.
 * 
 * @return {Promise<Object>} A promise that resolves to an object with the status and message of the cancellation.
 * @throws {Object} If the user details are not found or the user ID is not found, an object with status and message properties is thrown.
 * @throws {string} If an internal server error occurs, a string with the error message is thrown.
 */
const cancelAppointmentApi = async (data) => {

    try {

        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id })

        if (userDetails != null && (data.body.role_name === role.systemAdmin || data.body.role_name === role.admin)) {

            const appointmentDetails = await collections.AppointmentModel
                .findOneAndDelete({ appointment_id: data.body.appointment_id })

            if (appointmentDetails != null) {
                return returnStatement(true, "appointment is cancelled")
            }
            else { throw returnStatement(false, "appointment id not found") }
        }
        else {
            throw returnStatement(false,
                userDetails == null ? "used id is not found" :
                    `${data.body.role_name} user can't able to access this api`)
        }
    }
    catch (error) {
        if (error.status == false && error.message != null) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}


/**
 * Admin retrieves a list of hospital appointments based on the user's role and provided data.
 * This function takes in data containing the user's ID, role name, client ID, and the date for which appointments are requested. 
 * It then fetches appointments from the database based on the specified date and client ID. 
 * The returned array contains appointments filtered according to the user's role and the provided data.
 *
 * @param {string} data.body.user_id - The ID of the user.
 * @param {string} data.body.role_name - The role name of the user.
 * @param {string} data.body.client_id - The ID of the client.
 * @param {string} data.body.date - The date of the appointment.
 * @return {Array} An array of appointments based on the specified date and client_id.
 */
const listOfHospitalAppointmentsApi = async (data) => {

    try {

        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id })

        if (userDetails != null && (data.body.role_name === role.systemAdmin || data.body.role_name === role.admin)) {

            const appointments = await collections.AppointmentModel
                .find({ client_id: data.body.client_id, date: data.body.date },
                    { appointment_id: 1, scan_type: 1, doctor_id: 1, time: 1, patient_id: 1, _id: 0 })

            let listOfAppointments = []

            for (const appointment of appointments) {
                const patientName = await collections.PatientModel
                    .findOne({ patient_id: appointment.patient_id }, { _id: 0, patient_name: 1 })

                const doctorName = await collections.UserModel
                    .findOne({ user_id: appointment.doctor_id }, { user_details: 1, _id: 0 })
                    .populate({
                        path: 'user_details',
                        select: '-_id user_name',
                    })

                if (doctorName != null && patientName != null) {
                    const requiredFields = {
                        ...appointment._doc,
                        ...patientName._doc,
                        doctor_name: doctorName._doc.user_details._doc.user_name,
                    }
                    delete requiredFields.patient_id
                    listOfAppointments.push(requiredFields)
                }
            }
            return returnStatement(true, `list of appointment on ${data.body.date}`, listOfAppointments)
        }
        else {
            throw returnStatement(false,
                userDetails == null ? "used id is not found" :
                    `${data.body.role_name} user can't able to access this api`)
        }
    }

    catch (error) {
        if (error.status == false && error.message != null) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}


/**
 * Admin retrieves appointment details from the database based on the provided appointment ID.This function takes in a data 
 * object containing the appointment ID and retrieves the corresponding appointment details from the database.
 * If the appointment ID is found, it resolves to an object containing the appointment details.
 * If the appointment ID is not found, it throws an error.
 * 
 * @param {Object} data - An object containing the appointment ID.
 * @param {string} data.body.appointment_id - The ID of the appointment to retrieve.
 * 
 * @return {Promise<Object>} - A Promise that resolves to an object containing the appointment details.
 *                             If the appointment ID is not found, it throws an error.
 * 
 * @throws {Error} - Throws an error if either the doctor, robot, or patient ID is not found.
 *                   Throws an error if an internal server error occurs during the retrieval process.
 */
const appointmentDetailsApi = async (data) => {

    try {

        const appointmentDetails = await collections.AppointmentModel
            .findOne({ appointment_id: data.body.appointment_id },
                {
                    _id: 0, __v: 0, appointment_type: 0,
                    created_by: 0, is_report_sent: 0, action_required: 0,
                    createdAt: 0, updatedAt: 0, client_id: 0
                })

        if (appointmentDetails != null) {
            const patientId = await collections.PatientModel
                .findOne({ patient_id: appointmentDetails.patient_id },
                    {  // @rohith -change patient pincode (location api)
                        _id: 0, patient_name: 1, patient_email_id: 1,
                        patient_gender: 1, patient_age: 1, patient_mobile_number: 1,
                        patient_pin_code: 1, electronic_id: 1
                    })

            const doctorName = await collections.UserModel
                .findOne({ user_id: appointmentDetails.doctor_id }, { user_details: 1, _id: 0 })
                .populate({
                    path: 'user_details',
                    select: '-_id user_name',
                })

            const robotDetails = await collections.RobotModel
                .findOne({ robot_id: appointmentDetails.robot_id }, { robot_registration_id: 1, _id: 0 })

            if (patientId == null || doctorName == null || robotDetails == null) {
                throw returnStatement(false, "Either one of the following id is not found [doctor, robot, patient]")
            }
            return returnStatement(true, "appointment details", {
                ...patientId._doc,
                ...robotDetails._doc,
                doctor_name: doctorName.user_details.user_name,
                ...appointmentDetails._doc,
            })
        }
        else { throw returnStatement(false, "appointment id is not found") }
    }
    catch (error) {
        if (error.status == false && error.message != null) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}


/**
 * Admin reschedules an appointment based on the provided data. This function takes in a data object containing the
 * user ID, appointment ID, new date, and optionally new time. It then attempts to reschedule the appointment to the new date 
 * and time. 
 * 
 * @param {Object} data - An object containing the necessary data for rescheduling the appointment.
 * @param {string} data.body.user_id - The unique identifier of the user who owns the appointment.
 * @param {string} data.body.appointment_id - The unique identifier of the appointment to be rescheduled.
 * @param {string} data.body.date - The new date for the appointment.
 * @param {string} [data.body.time] - Optional. The new time for the appointment.
 * 
 * @return {Promise<Object>} A Promise that resolves to an object containing the status and message of the rescheduled appointment.
 * @throws {Object} Throws an object with status and message properties if the user details are not found or if the appointment ID is not found.
 * @throws {string} Throws a string with the error message if an internal server error occurs during the rescheduling process.
 */

const rescheduleAppointmentApi = async (data) => {

    try {
        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id })

        if (userDetails != null) {
            const appointmentDetails = await collections.AppointmentModel
                .findOneAndUpdate({ appointment_id: data.body.appointment_id },
                    { $set: { date: data.body.new_date, time: data.body.new_time } },
                    { new: true })
            if (appointmentDetails != null) {
                return returnStatement(true, "appointment is reschedule")
            }
            else { throw returnStatement(false, "appointment id not found") }
        }
        else { throw returnStatement(false, "user id not found") }

    }
    catch (error) {
        if (error.status == false && error.message != null) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}


/**
 * Admin edits an appointment based on the provided data. This function takes in a data object containing the user ID, 
 * appointment ID, and fields to update. It asynchronously updates the appointment with the specified changes and returns a 
 * Promise that resolves to an object containing the status and message of the edited appointment.
 *
 * @param {Object} data - The data object containing the user ID, appointment ID, and fields to update.
 * @param {string} data.body.user_id - The ID of the user.
 * @param {string} data.body.appointment_id - The ID of the appointment.
 * @return {Promise<Object>} A promise that resolves to an object with the status and message of the edited appointment.
 * @throws {string} If the user ID is not found or if the appointment ID is not found.
 */
const editAppointmentApi = async (data) => {

    try {
        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id })

        if (userDetails != null) {
            const fieldsToUpdate = data.body.edit
            const appointmentDetails = await collections.AppointmentModel
                .findOneAndUpdate({ appointment_id: data.body.appointment_id },
                    { $set: fieldsToUpdate },
                    { new: true })
            if (appointmentDetails != null) {
                return returnStatement(true, "appointment is edited")
            }
            else { throw returnStatement(false, "appointment id not found") }
        }
        else { throw returnStatement(false, "user id not found") }

    }
    catch (error) { throw error._message ? error._message : "internal server error" }
}


export default {
    searchPatientInformationApi, listOfHospitalRobotsApi,
    listOfHealthCenterApi, listOfHospitalDoctorsApi,
    listOfScanTypesApi, createNewAppointmentApi,
    cancelAppointmentApi, listOfHospitalAppointmentsApi,
    appointmentDetailsApi, rescheduleAppointmentApi,
    editAppointmentApi,
}

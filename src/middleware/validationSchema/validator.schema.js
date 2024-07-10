import joi from 'joi'
import { failResponse } from '../../utils/response.handle.js'
import { validateDateTime, isValidDate } from '../../utils/date.time.js'


/**
 * This is middleware function which validates the request body for creating a new client API.
 *
 * @function createNewClientApi
 * @param {Object} request - The request object containing the body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} Calls the next middleware function if the request body is valid, otherwise sends a fail response.
 */
const createNewClientApi = (request, response, next) => {

    const hospitalClientSchemaParams = {
        // This pattern refer the strings which containing one or more words with single white spaces between them
        hospital_name: joi.string().regex(/^[A-Za-z]+\s?([A-Za-z]+\s?)*$/).min(3).max(30).required(),
        logo_url: joi.string().uri().required(),
        domain_url: joi.string().uri().required(),
        scan_type: joi.array().items(joi.string().regex(/^[A-Za-z]+\s?([A-Za-z]+\s?)*$/).min(3).max(30)).optional(),
        department: joi.array().items(joi.string().regex(/^[A-Za-z]+\s?([A-Za-z]+\s?)*$/).min(3).max(30)).optional()
    }

    const clientDetails = {
        hospital_name: request.body.hospital_name,
        logo_url: request.body.logo_url,
        domain_url: request.body.domain_url,
    }

    if (request.body.scan_type) clientDetails.scan_type = request.body.scan_type

    if (request.body.department) clientDetails.department = request.body.department

    const { error } = joi.object(hospitalClientSchemaParams).validate(clientDetails)

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}


/**
 * This is middleware function to create a new user with validation.
 *
 * @function createNewUserApi
 * @param {Object} request - The request object.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void}
 */
const createNewUserApi = (request, response, next) => {

    let validationConditions = {
        client_id: joi.number().required(),
        user_name: joi.string().regex(/^[A-Za-z]+\s?([A-Za-z]+\s?)*$/).min(3).max(30).required(),
        user_email_id: joi.string().email().required(),
        user_contact_number: joi.string().regex(/^\d{10}$/).required(),
        user_location: joi.string().regex(/^[A-Za-z]+\s?([A-Za-z]+\s?)*$/).min(3).max(20).required(),
        user_pin_code: joi.number().required(),
        user_age: joi.number().min(1).max(110).required(),
        image_url: joi.string().uri().required(),
    }

    let userDetails = {
        client_id: request.body.client_id,
        user_name: request.body.user_name,
        user_email_id: request.body.user_email_id,
        user_contact_number: request.body.user_contact_number,
        user_location: request.body.user_location,
        user_pin_code: request.body.user_pin_code,
        image_url: request.body.image_url,
        user_age: request.body.user_age,
    }

    if (!(request.body.user_gender == 'male' || request.body.user_gender == 'female')) {
        failResponse(response, { status: false, message: "invalid gender name" })
    }
    if (request.route.path.includes('/create-new-admin')) {

        delete validationConditions.client_id
        delete userDetails.client_id

    }
    else if (request.route.path.includes('/create-new-system-admin')) {

        validationConditions.branch_id = joi.number().required()
        delete validationConditions.client_id

        userDetails.branch_id = request.body.branch_id
        delete userDetails.client_id

    }
    else if (request.route.path.includes('/create-new-doctor')) {

        const doctorDetailsValidation = {
            doctor_registration_id: joi.string().regex(/^[a-zA-Z0-9]+$/).min(4).max(30).required(),
            mbbs_completed_year: joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
            department_id: joi.number().required(),
            time_from: joi.string().pattern(/^(0[1-9]|1[0-2]):[0-5][0-9] [AP]M$/).optional(),
            time_to: joi.string().pattern(/^(0[1-9]|1[0-2]):[0-5][0-9] [AP]M$/).optional()
        }

        const doctorDetails = {
            doctor_registration_id: request.body.doctor_registration_id,
            mbbs_completed_year: request.body.mbbs_completed_year,
            department_id: request.body.department_id,
        }

        if (request.body.time_from) doctorDetails.time_from = request.body.time_from

        if (request.body.time_to) doctorDetails.time_to = request.body.time_to

        validationConditions = { ...validationConditions, ...doctorDetailsValidation }
        delete validationConditions.client_id

        userDetails = { ...userDetails, ...doctorDetails }
        delete userDetails.client_id
    }

    const { error } = joi.object(validationConditions).validate(userDetails)

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}


/**
 * This middleware function validates the request body for the scan type API.
 *
 * @function addScanType
 * @param {Object} request - The request object containing the body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} Calls the next middleware function if the request body is valid, otherwise sends a fail response.
 */
const addScanType = (request, response, next) => {

    const { error } = joi.object({ scan_type: joi.string().regex(/^[A-Za-z]+\s?([A-Za-z]+\s?)*$/).min(3).max(30).required() }).validate({ scan_type: request.body.scan_type })

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}


/**
 * This middleware function validates the request body for the scan type API.
 *
 * @function deleteScanType
 * @param {Object} request - The request object containing the body
 * @param {Object} response - The response object
 * @param {Function} next - The next middleware function
 * @return {void} Calls the next middleware function if the request body is valid, otherwise sends a fail response
 */
const deleteScanType = (request, response, next) => {

    const { error } = joi.object({ scan_type_id: joi.number().required() }).validate({ scan_type_id: request.body.scan_type_id })

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}


/**
 * This middleware function validates the request body for adding a department.
 *
 * @function addDepartment
 * @param {Object} request - The request object containing the body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} Calls the next middleware function if the request body is valid, otherwise sends a fail response.
 */
const addDepartment = (request, response, next) => {

    const { error } = joi.object({ department: joi.string().regex(/^[A-Za-z]+\s?([A-Za-z]+\s?)*$/).min(3).max(30).required() }).validate({ department: request.body.department })
    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}


/**
 * This is middleware function to validate the request body for deleting a department.
 *
 * @function deleteDepartment
 * @param {Object} request - The request object containing the body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} Calls the next middleware function if the request body is valid, otherwise sends a fail response.
 */
const deleteDepartment = (request, response, next) => {

    const { error } = joi.object({ department_id: joi.number().required() }).validate({ department_id: request.body.department_id })
    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}


/**
 * This is middleware function to create a new health center with validation.
 *
 * @function createNewHealthCenter
 * @param {Object} request - The request object.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void}
 */
const createNewHealthCenterApi = (request, response, next) => {
    const newHealthCenterSchema = joi.object(
        {
            branch_name: joi.string().regex(/^[A-Za-z]+\s?([A-Za-z]+\s?)*$/).min(3).max(30).required(),
            branch_contact_number: joi.string().regex(/^\d{10}$/).required(),
            branch_location: joi.string().regex(/^[A-Za-z]+\s?([A-Za-z]+\s?)*$/).min(3).max(30).required(),
            branch_pin_code: joi.number().required(),
        })

    const healthCenterDetails = {
        branch_name: request.body.branch_name,
        branch_contact_number: request.body.branch_contact_number,
        branch_location: request.body.branch_location,
        branch_pin_code: request.body.branch_pin_code,
    }
    const { error } = newHealthCenterSchema.validate(healthCenterDetails)

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}


/**
 * This is middleware function which validates the request body for creating a new robot API.
 *
 * @function createNewRobot
 * @param {Object} request - The request object containing the body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void}
 */
const createNewRobotApi = (request, response, next) => {
    const newRobotSchema = joi.object(
        {
            branch_id: joi.number().required(),
            robot_registration_id: joi.string().regex(/^[a-zA-Z0-9]+$/).min(4).max(30).required()
        })

    const robotDetails = {
        robot_registration_id: request.body.robot_registration_id,
        branch_id: request.body.branch_id,
    }
    const { error } = newRobotSchema.validate(robotDetails)

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}


/**
 * This is middleware function to validate if an existing user exists in the API.
 *
 * @function isExistingUser
 * @param {Object} request - The request object.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void}
 */
const isExistingUserApi = (request, response, next) => {

    const { error } = joi.object({ user_email_id: joi.string().email().required() }).validate({ user_email_id: request.body.user_email_id })

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}


/**
 * This is middleware function to validate the request body for setting a password API.
 * 
 * @function setPassword
 * @param {Object} request - The request object containing the body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} Calls the next middleware function if the request body is valid, otherwise sends a fail response.
 */
const setPasswordApi = (request, response, next) => {

    const { error } = joi.object({

        user_email_id: joi.string().email().required(),
        password: joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,16}$/).required()

    }).validate({ user_email_id: request.body.user_email_id, password: request.body.password })

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}


/**
 * This is middleware function to validate the request body for the login API.
 *
 * @function loginApi
 * @param {Object} request - The request object containing the body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} Calls the next middleware function if the request body is valid, otherwise sends a fail response.
 */
const loginApi = (request, response, next) => {
    const loginSchema = joi.object(
        {
            user_email_id: joi.string().email().required(),
            password: joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,16}$/).required(),
            role_id: joi.number().required()
        })

    const { error } = loginSchema.validate({
        user_email_id: request.body.user_email_id,
        password: request.body.password,
        role_id: request.body.role_id
    })

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}


/**
 * This is middleware function to validate the request body for the verifyOptApi API.
 *
 * @function verifyOptApi
 * @param {Object} request - The request object containing the body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} Calls the next middleware function if the request body is valid, otherwise sends a fail response.
 */
const verifyOptApi = (request, response, next) => {

    const verifyOtpSchema = joi.object(
        {
            user_email_id: joi.string().email().required(),
            otp: joi.string().regex(/^[0-9]+$/).min(4).max(4).required()
        })

    const { error } = verifyOtpSchema.validate({ user_email_id: request.body.user_email_id, otp: request.body.otp })

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}


/**
 * This is middleware function to validate the request body for the create new patients API.
 *
 * @function createNewPatientsApi
 * @param {Object} request - The request object containing the body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} Calls the next middleware function if the request body is valid, otherwise sends a fail response.
 */
const createNewPatientsApi = (request, response, next) => {

    const patientValidation = {
        op_id: joi.string().regex(/^[a-zA-Z0-9]+$/).min(4).max(30).optional(),
        patient_mobile_number: joi.string().regex(/^\d{10}$/).required(),
        patient_name: joi.string().regex(/^[A-Za-z]+\s?([A-Za-z]+\s?)*$/).min(3).max(30).required(),
        patient_email_id: joi.string().email().optional(),
        patient_age: joi.number().required(),
        patient_pin_code: joi.number().required(),
        patient_address: joi.string().min(8).max(120).optional(),
        electronic_id: joi.string().regex(/^[a-zA-Z0-9]+$/).min(4).max(20).optional()
    }

    if (!(request.body.patient_gender == 'male' || request.body.patient_gender == 'female'))
        failResponse(response, { status: false, message: "invalid gender name" })

    const patientDetails = {
        patient_mobile_number: request.body.patient_mobile_number,
        patient_name: request.body.patient_name,
        patient_age: request.body.patient_age,
        patient_pin_code: request.body.patient_pin_code
    }

    if (request.body.op_id) patientDetails.op_id = request.body.op_id
    if (request.body.electronic_id) patientDetails.electronic_id = request.body.electronic_id
    if (request.body.patient_address) patientDetails.patient_address = request.body.patient_address
    if (request.body.patient_email_id) patientDetails.patient_email_id = request.body.patient_email_id

    if (request.route.path.includes('/edit-patient-details')) {

        patientValidation.patient_id = joi.number().required()
        patientDetails.patient_id = request.body.patient_id
    }

    const { error } = joi.object(patientValidation).validate(patientDetails)
    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}


// * Doctor module

/**
 * This is middleware function to validates the request body for the doctor details API.
 * 
 * @function doctorDetailsApi
 * @param {Object} request - The request object containing the body with the doctor ID.
 * @param {Object} response - The response object to send the validation result.
 * @param {Function} next - The next middleware function to call if the validation passes.
 * @return {void} This function does not return anything.
 */
const doctorDetailsApi = (request, response, next) => {

    const doctorSchema = joi.object({ doctor_id: joi.number().required() })

    const { error } = doctorSchema.validate({ doctor_id: request.body.doctor_id })
    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}


/**
 * This is middleware function to validates the request body for the doctor details API.
 *
 * @function editDoctorDetailsApi
 * @param {Object} request - The request object containing the body with the doctor ID.
 * @param {Object} response - The response object to send the validation result.
 * @param {Function} next - The next middleware function to call if the validation passes.
 * @return {void} This function does not return anything.
 */
const editDoctorDetailsApi = (request, response, next) => {

    let validationConditions = {

        doctor_id: joi.number().required(),
        user_name: joi.string().regex(/^[A-Za-z]+\s?([A-Za-z]+\s?)*$/).min(3).max(30).required(),
        user_email_id: joi.string().email().required(),
        user_contact_number: joi.string().regex(/^\d{10}$/).required(),
        user_location: joi.string().regex(/^[A-Za-z]+\s?([A-Za-z]+\s?)*$/).min(3).max(30).required(),
        user_pin_code: joi.number().required(),
        user_age: joi.number().min(1).max(110).required(),
        image_url: joi.string().uri().required(),
        doctor_registration_id: joi.string().regex(/^[a-zA-Z0-9]+$/).min(4).max(30).required(),
        mbbs_completed_year: joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
        department_id: joi.number().required(),
        time_from: joi.string().pattern(/^(0[1-9]|1[0-2]):[0-5][0-9] [AP]M$/).optional(),
        time_to: joi.string().pattern(/^(0[1-9]|1[0-2]):[0-5][0-9] [AP]M$/).optional()
    }

    if (!(request.body.user_gender == 'male' || request.body.user_gender == 'female')) {
        failResponse(response, { status: false, message: "invalid gender name" })
    }

    const doctorDetails = {

        doctor_id: request.body.doctor_id,
        user_name: request.body.user_name,
        user_email_id: request.body.user_email_id,
        user_contact_number: request.body.user_contact_number,
        user_location: request.body.user_location,
        user_pin_code: request.body.user_pin_code,
        image_url: request.body.image_url,
        user_age: request.body.user_age,
        doctor_registration_id: request.body.doctor_registration_id,
        mbbs_completed_year: request.body.mbbs_completed_year,
        department_id: request.body.department_id,
    }

    if (request.body.time_from) doctorDetails.time_from = request.body.time_from

    if (request.body.time_to) doctorDetails.time_to = request.body.time_to

    const { error } = joi.object(validationConditions).validate(doctorDetails)

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}


// * Appointment module

/**
 * This is middleware function that validates the request body for the search patient information API.
 *
 * @function searchPatientInformationApi
 * @param {Object} request - The request object containing the body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} Calls the next middleware function if the request body is valid, otherwise sends a fail response.
 */
const searchPatientInformationApi = (request, response, next) => {

    const { error } = joi.object({ phone_number: joi.string().regex(/^\d{10}$/).required() }).validate({ phone_number: request.body.patient_mobile_number })

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}


/**
 * This is middleware function that validates the request body for the list of hospital robots API.
 *
 * @function listOfHospitalRobotsApi
 * @param {Object} request - The request object containing the body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} Calls the next middleware function if the request body is valid, otherwise sends a fail response.
 */
const listOfHospitalRobotsApi = (request, response, next) => {

    const listOfRobotSchema = joi.object({ branch_id: joi.number().required() })

    const { error } = listOfRobotSchema.validate({ branch_id: request.body.branch_id })

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}

const customJoi = joi.extend((joi) => ({
    type: 'futureDate',
    base: joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
    messages: {
        'date.future': '{{#label}} must be today or a future date',
    },
    validate(value, helpers) {
        const [year, month, day] = value.split('-').map(Number)

        if (!isValidDate(year, month, day)) {
            return { value, errors: helpers.error('date.future') }
        }
    }
}))


/**
 * This is middleware function that validates the input data for creating a new appointment.
 *
 * @function createNewAppointmentApi
 * @param {Object} request - The request object.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void}
 */
const createNewAppointmentApi = (request, response, next) => {

    const appointmentSchema =
    {
        patient_mobile_number: joi.string().regex(/^\d{10}$/).required(),
        patient_name: joi.string().regex(/^[A-Za-z]+\s?([A-Za-z]+\s?)*$/).min(3).max(30).required(),
        patient_age: joi.number().min(1).max(110).required(),
        patient_pin_code: joi.number().required(),
        branch_id: joi.number().required(),
        robot_id: joi.number().required(),
        doctor_id: joi.number().required(),
        date: customJoi.futureDate().required().label('Appointment-Date'),
        time: joi.string().pattern(/^(0[1-9]|1[0-2]):[0-5][0-9] [AP]M$/).required().label('Appointment-Time'),
        scan_type_id: joi.number().required(),
        differential_diagnosis: joi.string().min(5).required(),
        patient_id: joi.number().optional(),
        op_id: joi.string().regex(/^[a-zA-Z0-9]+$/).min(4).max(30).optional(),
        billing_id: joi.string().regex(/^[a-zA-Z0-9]+$/).min(4).max(30).optional(),
        electronic_id: joi.string().regex(/^[a-zA-Z0-9]+$/).min(4).max(16).optional(),
        patient_address: joi.string().min(8).max(60).optional(),
        patient_email_id: joi.string().email().optional()
    }

    if (!(request.body.patient_gender == 'male' || request.body.patient_gender == 'female')) {
        failResponse(response, { status: false, message: "invalid gender name" })
    }

    const appointmentDetails = {

        patient_mobile_number: request.body.patient_mobile_number,
        patient_name: request.body.patient_name,
        patient_age: request.body.patient_age,
        patient_pin_code: request.body.patient_pin_code,
        branch_id: request.body.branch_id,
        robot_id: request.body.robot_id,
        doctor_id: request.body.doctor_id,
        date: request.body.date,
        time: request.body.time,
        scan_type_id: request.body.scan_type_id,
        differential_diagnosis: request.body.differential_diagnosis,

    }

    if (request.body.patient_id) appointmentDetails.patient_id = request.body.patient_id

    if (request.body.op_id) appointmentDetails.op_id = request.body.op_id

    if (request.body.billing_id) appointmentDetails.billing_id = request.body.billing_id

    if (request.body.electronic_id) appointmentDetails.electronic_id = request.body.electronic_id

    if (request.body.patient_address) appointmentDetails.patient_address = request.body.patient_address

    if (request.body.patient_email_id) appointmentDetails.patient_email_id = request.body.patient_email_id

    const { error } = joi.object(appointmentSchema).custom((value, helpers) => {

        const { date, time } = value

        if (!validateDateTime(date, time)) {
            return helpers.message('Appointment date and time must be in the future')
        }
        return value

    }, 'Future Date and Time Validation').validate(appointmentDetails)

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') || error.details[0].message.includes('Appointment date and time must be in the future') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}


/**
 * This is middleware validation for appointment details and handles errors accordingly.
 *
 * @function appointmentDetailsApi
 * @param {object} request - the request object
 * @param {object} response - the response object
 * @param {function} next - the next function to execute
 * @return {void} no return value
 */
const appointmentDetailsApi = (request, response, next) => {

    const appointmentSchema = joi.object({ appointment_id: joi.number().required() })

    const { error } = appointmentSchema.validate({ appointment_id: request.body.appointment_id })

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}


/**
 * This is middleware function for editing appointment details with input validation.
 *
 * @function editAppointmentApi
 * @param {Object} request - The request object.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void}
 */
const editAppointmentApi = (request, response, next) => {

    const appointmentSchema = {
        appointment_id: joi.number().required(),
        doctor_id: joi.number().required(),
        branch_id: joi.number().required(),
        robot_id: joi.number().required(),
        billing_id: joi.string().regex(/^[a-zA-Z0-9]+$/).min(4).max(30).optional(),
        date: customJoi.futureDate().required().label('Appointment-Date'),
        time: joi.string().pattern(/^(0[1-9]|1[0-2]):[0-5][0-9] [AP]M$/).required().label('Appointment-Time'),
        scan_type_id: joi.number().required(),
        differential_diagnosis: joi.string().min(5).required(),
    }

    const appointmentDetails = {

        appointment_id: request.body.appointment_id,
        branch_id: request.body.branch_id,
        robot_id: request.body.robot_id,
        doctor_id: request.body.doctor_id,
        date: request.body.date,
        time: request.body.time,
        scan_type_id: request.body.scan_type_id,
        differential_diagnosis: request.body.differential_diagnosis,
    }

    if (request.body.billing_id) appointmentDetails.billing_id = request.body.billing_id

    const { error } = joi.object(appointmentSchema).validate(appointmentDetails)

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }

}


/**
 * This is middleware function that validates the request body for the list of hospital appointments API.
 *
 * @function listOfHospitalAppointmentsApi
 * @param {Object} request - The request object containing the body with the date.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void}
 */
const listOfHospitalAppointmentsApi = (request, response, next) => {

    const appointmentSchema = joi.object({ date: customJoi.futureDate().required().label('Appointment-Date') })

    const { error } = appointmentSchema.validate({ date: request.body.date })

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }

}


/**
 * This is middleware function for validating the request body for the rescheduleAppointmentApi API.
 *
 * @function rescheduleAppointmentApi
 * @param {Object} request - The request object containing the body with the appointment details.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void}
 */
const rescheduleAppointmentApi = (request, response, next) => {

    const appointmentSchema = joi.object({

        date: customJoi.futureDate().required().label('Appointment-Date'),
        time: joi.string().pattern(/^(0[1-9]|1[0-2]):[0-5][0-9] [AP]M$/).required().label('Appointment-Time'),
        appointment_id: joi.number().required(),
        doctor_name: joi.string().regex(/^[A-Za-z]+\s?([A-Za-z]+\s?)*$/).min(3).max(30).required()
    })

    const { error } = appointmentSchema.validate({
        date: request.body.date,
        time: request.body.time,
        appointment_id: request.body.appointment_id,
        doctor_name: request.body.doctor_name
    })

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}


/**
 * This is middleware function validates the request body for patient report API.
 *
 * @function patientReportApi
 * @param {Object} request - The request object.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void}
 */
const patientReportApi = (request, response, next) => {

    const { error } = joi.object({ appointment_id: joi.number().required(), report_details: joi.string().required() })
        .validate({ appointment_id: request.body.appointment_id, report_details: request.body.report_details })

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}


/**
 * This is middleware function to validate the request body for adding a report template API.
 * 
 * @function addReportTemplateApi
 * @param {Object} request - The request object containing the body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} Calls the next middleware function if the request body is valid, otherwise sends a fail response.
 */
const addReportTemplateApi = (request, response, next) => {

    const { error } = joi.object({ template_name: joi.string().regex(/^[A-Za-z]+\s?([A-Za-z]+\s?)*$/).min(3).max(30).required(), template: joi.string().required() })
        .validate({ template_name: request.body.template_name, template: request.body.template })

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}

/**
 * This is middleware function to validate the request body for deleting a report template API.
 * 
 * @function deleteReportTemplateApi
 * @param {Object} request - The request object containing the body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} Calls the next middleware function if the request body is valid, otherwise sends a fail response.
 */
const deleteReportTemplateApi = (request, response, next) => {

    const { error } = joi.object({ template_id: joi.number().required() }).validate({ template_id: request.body.template_id })

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}

const robotMaintenanceStatusApi = (request, response, next) => { next() }



export default {
    isExistingUserApi, setPasswordApi, loginApi,
    verifyOptApi, addReportTemplateApi, addScanType,
    addDepartment, createNewPatientsApi,
    createNewAppointmentApi, createNewClientApi,
    createNewUserApi, createNewHealthCenterApi,
    createNewRobotApi, robotMaintenanceStatusApi,
    editAppointmentApi, doctorDetailsApi,
    editDoctorDetailsApi, patientReportApi,
    searchPatientInformationApi, appointmentDetailsApi,
    rescheduleAppointmentApi, listOfHospitalRobotsApi,
    listOfHospitalAppointmentsApi, deleteScanType,
    deleteReportTemplateApi, deleteDepartment
}

import joi from 'joi'
import { failResponse } from '../../utils/response.handle.js'
import { validateDateTime, isValidDate } from '../../utils/date.time.js'

/**
 * Validates the request body for creating a new client API.
 *
 * @param {Object} request - The request object containing the body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} Calls the next middleware function if the request body is valid, otherwise sends a fail response.
 */
const createNewClientApi = (request, response, next) => {

    const hospitalClientSchemaParams = {
        // This pattern refer the strings which containing one or more words with single white spaces between them
        hospital_name: joi.string().regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/).min(3).max(30).required(),
        logo_url: joi.string().uri().required(),
        domain_url: joi.string().uri().required(),
    }

    const clientDetails = {
        hospital_name: request.body.hospital_name,
        logo_url: request.body.logo_url,
        domain_url: request.body.domain_url,
    }

    if (request.body.scan_type != null) {
        clientDetails.scan_type = request.body.scan_type
        hospitalClientSchemaParams.scan_type = joi.array().items(joi.string().regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/).min(3).max(30))
    }

    if (request.body.department != null) {
        clientDetails.department = request.body.department
        hospitalClientSchemaParams.department = joi.array().items(joi.string().regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/).min(3).max(30))
    }
    
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
 * Middleware function to create a new user with validation.
 *
 * @param {Object} request - The request object.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void}
 */
const createNewUserApi = (request, response, next) => {

    let validationConditions = {
        client_id: joi.number().required(),
        user_name: joi.string().regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/).min(3).max(30).required(),
        user_email_id: joi.string().email().required(),
        user_contact_number: joi.string().regex(/^\d{10}$/).required(),
        user_location: joi.string().regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)?$/).min(3).max(20).required(),
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
        failResponse(response, { status: false, message: "invalid gender" })
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
            doctor_department: joi.string().regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/).min(3).max(30).required(),
            is_approved: joi.boolean().required(),
        }

        const doctorDetails = {
            doctor_registration_id: request.body.doctor_registration_id,
            mbbs_completed_year: request.body.mbbs_completed_year,
            doctor_department: request.body.doctor_department,
            is_approved: request.body.is_approved,
        }

        if (request.body.time_from != null) {
            doctorDetails.time_from = request.body.time_from
            doctorDetailsValidation.time_from = joi.string().pattern(/^(0[1-9]|1[0-2]):[0-5][0-9] [AP]M$/).required()
        }

        if (request.body.time_to != null) {
            doctorDetails.time_to = request.body.time_to
            doctorDetailsValidation.time_to = joi.string().pattern(/^(0[1-9]|1[0-2]):[0-5][0-9] [AP]M$/).required()
        }

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
 * Validates the request body for the scan type API.
 *
 * @param {Object} request - The request object containing the body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} Calls the next middleware function if the request body is valid, otherwise sends a fail response.
 */
const scanType = (request, response, next) => {
    const scanTypeSchema = joi.object(
        {
            scan_type: joi.string().regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/).min(3).max(30).required()
        })

    const { error } = scanTypeSchema.validate({ scan_type: request.body.scan_type })

    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}

const department = (request, response, next) => {
    const departmentSchema = joi.object(
        {
            department: joi.string().regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/).min(3).max(30).required()
        })

    const { error } = departmentSchema.validate({ department: request.body.department })
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
 * Middleware function to create a new health center with validation.
 *
 * @param {Object} request - The request object.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void}
 */
const createNewHealthCenterApi = (request, response, next) => {
    const newHealthCenterSchema = joi.object(
        {
            branch_name: joi.string().regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/).min(3).max(30).required(),
            branch_contact_number: joi.string().regex(/^\d{10}$/).required(),
            branch_location: joi.string().regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/).min(3).max(20).required(),
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
 * Validates the request body for creating a new robot API.
 *
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
 * Middleware function to validate if an existing user exists in the API.
 *
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
 * Middleware function to validate the request body for setting a password API.
 *
 * @param {Object} request - The request object containing the body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} Calls the next middleware function if the request body is valid, otherwise sends a fail response.
 */
const setPasswordApi = (request, response, next) => {

    const { error } = joi.object({

        user_email_id: joi.string().email().required(),
        password: joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,}$/).required()

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
 * Middleware function to validate the request body for the login API.
 *
 * @param {Object} request - The request object containing the body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} Calls the next middleware function if the request body is valid, otherwise sends a fail response.
 */
const loginApi = (request, response, next) => {
    const loginSchema = joi.object(
        {
            user_email_id: joi.string().email().required(),
            password: joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,}$/).required(),
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
 * Middleware function to validate the request body for the create new patients API.
 *
 * @param {Object} request - The request object containing the body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} Calls the next middleware function if the request body is valid, otherwise sends a fail response.
 */
const createNewPatientsApi = (request, response, next) => {
    const patientSchema = joi.object(
        {
            user_id: joi.number().required(),
            op_id: joi.string().regex(/^[a-zA-Z0-9]+$/).min(4).max(30),
            patient_mobile_number: joi.string().regex(/^\d{10}$/).required(),
            patient_name: joi.string().regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/).min(3).max(30).required(),
            patient_email_id: joi.string().email(),
            patient_gender: joi.string().regex(/^[a-zA-Z]+$/).required(),
            patient_age: joi.number().required(),
            patient_pin_code: joi.number().required(),
            electronic_id: joi.string().trim().regex(/^[a-zA-Z0-9]+$/).min(4).max(30)
        })

    const patientDetails = {
        op_id: request.body.op_id,
        patient_mobile_number: request.body.patient_mobile_number,
        patient_name: request.body.patient_name,
        patient_email_id: request.body.patient_email_id,
        patient_gender: request.body.patient_gender,
        patient_age: request.body.patient_age,
        patient_pin_code: request.body.patient_pin_code,
        electronic_id: request.body.electronic_id,
        user_id: request.body.user_id,
    }
    const { error } = patientSchema.validate(patientDetails)
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
 * Validates the request body for the patient details API.
 *
 * @param {Object} request - The request object containing the body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void}
 */
const patientDetailsApi = (request, response, next) => {
    const patientSchema = joi.object(
        {
            user_id: joi.number().required(),
            patient_id: joi.number().required(),
        })

    const { error } = patientSchema.validate({
        user_id: request.body.user_id,
        patient_id: request.body.patient_id,
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
 * Validates the request body for editing patient details API.
 *
 * @param {Object} request - The request object containing the body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void}
 */
const editPatientDetailsApi = (request, response, next) => {
    const patientSchema = joi.object(
        {
            user_id: joi.number(),
            op_id: joi.string().regex(/^[a-zA-Z0-9]+$/).min(4).max(30),
            patient_mobile_number: joi.string().regex(/^\d{10}$/),
            patient_name: joi.string().regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/).min(3).max(30),
            patient_email_id: joi.string(),
            patient_gender: joi.string().regex(/^[a-zA-Z]+$/),
            patient_age: joi.number(),
            patient_pin_code: joi.number(),
            electronic_id: joi.string().regex(/^[a-zA-Z0-9]+$/).min(4).max(30),
        })

    const patientDetails = {
        op_id: request.body.op_id,
        patient_mobile_number: request.body.patient_mobile_number,
        patient_name: request.body.patient_name,
        patient_email_id: request.body.patient_email_id,
        patient_gender: request.body.patient_gender,
        patient_age: request.body.patient_age,
        patient_pin_code: request.body.patient_pin_code,
        electronic_id: request.body.electronic_id,
        user_id: request.body.user_id,
    }
    const { error } = patientSchema.validate(patientDetails)
    if (error) {
        failResponse(response, {
            status: false,
            message: error.details[0].message.includes('is required') ?
                error.details[0].message : `invalid input in ${error.details[0].message.split(" ")[0]}`
        })
    }
    else { next() }
}


// doctor module:

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
const editDoctorDetailsApi = (request, response, next) => { next() }


// appointment module:

const searchPatientInformationApi = (request, response, next) => { next() }

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

const createNewAppointmentApi = (request, response, next) => {

    const appointmentSchema = 
    {
        patient_mobile_number: joi.string().regex(/^\d{10}$/).required(),
        patient_name: joi.string().regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/).min(3).max(30).required(),
        patient_gender: joi.string().regex(/^[a-zA-Z]+$/).required(),
        patient_age: joi.number().min(1).max(110).required(),
        patient_pin_code: joi.number().required(),
        branch_id: joi.number().required(),
        robot_id: joi.number().required(),
        doctor_id: joi.number().required(),
        date: customJoi.futureDate().required().label('Appointment-Date'),
        time: joi.string().pattern(/^(0[1-9]|1[0-2]):[0-5][0-9] [AP]M$/).required().label('Appointment-Time'),
        scan_type: joi.string().regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/).min(3).max(30).required(),
        differential_diagnosis: joi.string().regex(/^(?!.* {2})(?!.*\n{2})([A-Za-z0-9.'\-#@%&/, \n]*)$/).min(3).max(30).required()

    }

    const appointmentDetails = {

        patient_mobile_number: request.body.patient_mobile_number,
        patient_name: request.body.patient_name,
        patient_gender: request.body.patient_gender,
        patient_age: request.body.patient_age,
        patient_pin_code: request.body.patient_pin_code,
        branch_id: request.body.branch_id,
        robot_id: request.body.robot_id,
        doctor_id: request.body.doctor_id,
        date: request.body.date,
        time: request.body.time,
        scan_type: request.body.scan_type,
        differential_diagnosis: request.body.differential_diagnosis,
    
    }

    if (request.body.patient_id != null)
    {
        appointmentDetails.patient_id = request.body.patient_id
        appointmentSchema.patient_id = joi.number()
    }

    if (request.body.op_id != null)
    {
        appointmentDetails.op_id = request.body.op_id
        appointmentSchema.op_id = joi.string().regex(/^[a-zA-Z0-9]+$/).min(4).max(30)
    }

    if (request.body.billing_id != null)
    {
        appointmentDetails.billing_id = request.body.billing_id
        appointmentSchema.billing_id =  joi.string().regex(/^[a-zA-Z0-9]+$/).min(4).max(30)
    }

    if (request.body.electronic_id != null)
    {
        appointmentDetails.electronic_id = request.body.electronic_id
        appointmentSchema.electronic_id = joi.string().regex(/^[a-zA-Z0-9]+$/).min(4).max(16)
    }

    if (request.body.patient_address != null)
    {
        appointmentDetails.patient_address = request.body.patient_address
        appointmentSchema.patient_address = joi.string().regex(/^(?!.* {2})(?!.*\n{2})([A-Za-z0-9.'\-#@%&/, \n]*)$/).min(8).max(36)
    }

    if (request.body.patient_email_id != null)
    {
        appointmentDetails.patient_email_id = request.body.patient_email_id
        appointmentSchema.patient_email_id = joi.string().email()
    }

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

const cancelAppointmentApi = (request, response, next) => {

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


const editAppointmentApi = (request, response, next) => { 

    const appointmentSchema = {
      
        appointment_id: joi.number().required(),
        doctor_id: joi.number().required(),
        branch_id: joi.number().required(),
        robot_id: joi.number().required(),
        date: customJoi.futureDate().required().label('Appointment-Date'),
        time: joi.string().pattern(/^(0[1-9]|1[0-2]):[0-5][0-9] [AP]M$/).required().label('Appointment-Time'),
        scan_type: joi.string().regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/).min(3).max(30).required(),
        differential_diagnosis: joi.string().regex(/^(?!.* {2})(?!.*\n{2})([A-Za-z0-9.'\-#@%&/, \n]*)$/).min(3).max(30).required()
    }

    const appointmentDetails = {

        appointment_id: request.body.appointment_id,
        branch_id: request.body.branch_id,
        robot_id: request.body.robot_id,
        doctor_id: request.body.doctor_id,
        date: request.body.date,
        time: request.body.time,
        scan_type: request.body.scan_type,
        differential_diagnosis: request.body.differential_diagnosis,
    
    }
    
    if (request.body.op_id != null)
    {
        appointmentDetails.op_id = request.body.op_id
        appointmentSchema.op_id =  joi.string().regex(/^[a-zA-Z0-9]+$/).min(4).max(30).required()
    }

    if (request.body.billing_id != null)
    {
        appointmentDetails.billing_id = request.body.billing_id
        appointmentSchema.billing_id =  joi.string().regex(/^[a-zA-Z0-9]+$/).min(4).max(30).required()
    }

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


export default {
    createNewClientApi, createNewUserApi, scanType, department,
    createNewHealthCenterApi, createNewRobotApi, isExistingUserApi,
    setPasswordApi, loginApi, verifyOptApi, patientDetailsApi, createNewPatientsApi,
    editPatientDetailsApi, doctorDetailsApi, editDoctorDetailsApi, searchPatientInformationApi,
    listOfHospitalRobotsApi, createNewAppointmentApi, appointmentDetailsApi, cancelAppointmentApi, editAppointmentApi,
    listOfHospitalAppointmentsApi
}

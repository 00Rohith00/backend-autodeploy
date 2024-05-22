import joi from 'joi'
import { failResponse } from '../../utils/response.handle.js'

/**
 * Validates the request body for creating a new client API.
 *
 * @param {Object} request - The request object containing the body.
 * @param {Object} response - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} Calls the next middleware function if the request body is valid, otherwise sends a fail response.
 */
const createNewClientApi = (request, response, next) => {
    const hospitalClientSchema = joi.object(
        {
            // This pattern refer the strings which containing one or more words with single white spaces between them
            hospital_name: joi.string().regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/).min(3).max(30).required(),
            logo_url: joi.string().uri().required(),
            domain_url: joi.string().uri().required(),
            scan_type: joi.array().items(joi.string().regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/).min(3).max(30).optional()),
            department: joi.array().items(joi.string().regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/).min(3).max(30).optional())
        }
    )

    const clientDetails = {
        hospital_name: request.body.hospital_name,
        logo_url: request.body.logo_url,
        domain_url: request.body.domain_url,
        scan_type: request.body.scan_type,
        department: request.body.department
    }
    const { error } = hospitalClientSchema.validate(clientDetails)

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

    if (!(request.body.user_gender == 'male' || request.body.user_gender == 'female'))
    {
        failResponse(response, { status: false, message: "invalid gender"})  
    }
    if (request.route.path.includes('/create-new-admin')) {

        validationConditions.user_id = joi.number().required()
        delete validationConditions.client_id

        userDetails.user_id = request.body.user_id
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
            time_from:  joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/).optional(), 
            time_to: joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/).optional(), 
            is_approved: joi.boolean().required(),

        }

        validationConditions = { ...validationConditions, ...doctorDetailsValidation }
        delete validationConditions.client_id

        const doctorDetails = {
            doctor_registration_id: request.body.doctor_registration_id,
            mbbs_completed_year: request.body.mbbs_completed_year,
            doctor_department: request.body.doctor_department,
            time_from: request.body.time_from,
            time_to: request.body.time_to,
            is_approved: request.body.is_approved,
        }

        userDetails = { ...userDetails, ...doctorDetails }
        delete userDetails.client_id
    }

    const userSchema = joi.object(validationConditions)
    const { error } = userSchema.validate(userDetails)

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
            branch_location: joi.string().regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)?$/).min(3).max(20).required(),
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
    const isExistingUserSchema = joi.object(
        {
            user_email_id: joi.string().email().required(),
        })

    const { error } = isExistingUserSchema.validate({ user_email_id: request.body.user_email_id })

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
    const setPasswordSchema = joi.object(
        {
            user_email_id: joi.string().email().required(),
            password: joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,}$/).required()
        })

    const { error } = setPasswordSchema.validate({ user_email_id: request.body.user_email_id, password: request.body.password })

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
            electronic_id: joi.string().trim().regex(/^[a-zA-Z0-9]+$/).min(4).max(30).required(),
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

    const { error } = doctorSchema.validate({ doctor_id: request.body.doctor_id})
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


export default {
    createNewClientApi, createNewUserApi,
    scanType, department, createNewHealthCenterApi,
    createNewRobotApi, isExistingUserApi,
    setPasswordApi, loginApi, verifyOptApi,
    patientDetailsApi, createNewPatientsApi,
    editPatientDetailsApi, doctorDetailsApi,
    editDoctorDetailsApi
}


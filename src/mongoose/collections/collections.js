import mongoose from 'mongoose'
import AutoIncrement from 'mongoose-sequence'

const AutoIncrementPlugin = AutoIncrement(mongoose)

/**
 * Represents the details of a hospital client.
 * @type {Object} HospitalClientDetails
 * @property {number} client_id - The unique identifier of the client.
 * @property {string} hospital_name - The name of the hospital.
 * @property {string} logo_url - The URL of the hospital's logo.
 * @property {string} domain_url - The domain URL of the hospital.
 * @property {Array<string>} scan_type - An array of scan types offered by the hospital.
 */
const hospitalClientSchema = new mongoose.Schema({
    client_id: { type: Number, unique: true },
    hospital_name: { type: String, unique: true, required: true },
    logo_url: { type: String, required: true },
    domain_url: { type: String, required: true },
    scan_type: { type: Array },
    department: { type: Array },
    templates: { type: Array }

}, { timestamps: true }, { versionKey: false })
/**
 * Plugin for auto-incrementing the client_id field in the HospitalClientSchema.
 */
hospitalClientSchema.plugin(AutoIncrementPlugin, { inc_field: 'client_id' })
/**
 * Mongoose model representing hospital clients.
 * @type {HospitalClientModel}
 */
const HospitalClientModel = mongoose.model("hospital_client", hospitalClientSchema)


/**
 * Represents the details of a user.
 * @type {Object} User
 * @property {number} user_id - The unique identifier of the user.
 * @property {number} client_id - The client ID associated with the user.
 * @property {number} [branch_id] - The branch ID associated with the user.
 * @property {mongoose.Types.ObjectId} user_details - The reference to the user details.
 * @property {mongoose.Types.ObjectId} user_roles - The reference to the user roles.
 * @property {mongoose.Types.ObjectId} user_login - The reference to the user login.
 * @property {string} image_url - The URL of the user's image.
 * @property {boolean} is_archive - Indicates if the user is archived.
 * @property {number} [created_by] - The user ID of the creator.
 * @property {Date} createdAt - The timestamp when the user was created.
 * @property {Date} updatedAt - The timestamp when the user was last updated.
 */
const userSchema = new mongoose.Schema({
    user_id: { type: Number, unique: true },
    client_id: { type: Number, required: true },
    branch_id: { type: Number },
    user_details: { type: mongoose.SchemaTypes.ObjectId, ref: 'user_details', required: true },
    user_roles: { type: mongoose.SchemaTypes.ObjectId, ref: 'user_roles', required: true },
    user_login: { type: mongoose.SchemaTypes.ObjectId, ref: 'user_login', required: true },
    image_url: { type: String, required: true },
    is_archive: { type: Boolean, required: true },
    created_by: { type: Number },
}, { timestamps: true }, { versionKey: false })
/**
 * Plugin for auto-incrementing the user_id field in the userSchema.
 */
userSchema.plugin(AutoIncrementPlugin, { inc_field: 'user_id' })
/**
 * Mongoose model for user.
 * @type {UserModel}
 */
const UserModel = mongoose.model("user", userSchema)


/**
 * Represents the details of a new user.
 * @type {Object} UserDetails
 * @property {string} user_name - The name of the user.
 * @property {string} user_email_id - The email id of the user.
 * @property {string} user_contact_number - The contact number of the user.
 * @property {string} user_location - The location of the user.
 * @property {number} user_pin_code - The pin code of the user.
 * @property {string} doctor - The ID of the associated doctor.
 */
const userDetailSchema = new mongoose.Schema({
    user_name: { type: String, required: true },
    user_email_id: { type: String, required: true, unique: true },
    user_contact_number: { type: String, required: true },
    user_location: { type: String, required: true },
    user_pin_code: { type: Number, required: true },
    user_gender: { type: String, required: true },
    user_age: { type: Number, required: true },
    doctor: { type: mongoose.SchemaTypes.ObjectId, ref: 'doctor' },
}, { timestamps: true }, { versionKey: false })
/**
 * Mongoose model for user details.
 * @type {UserDetailModel}
 */
const UserDetailModel = mongoose.model("user_details", userDetailSchema)


/**
 * Represents the details of a user role.
 * @type {Object} UserRoleDetails
 * @property {number} role_id - The ID of the role.
 * @property {string} role_name - The name of the role.
 */
const userRoleSchema = new mongoose.Schema({
    role_id: { type: Number, required: true },
    role_name: { type: String, required: true },
}, { timestamps: true }, { versionKey: false })
/**
 * Mongoose model for user role.
 * @type {UserRoleModel}
 */
const UserRoleModel = mongoose.model("user_roles", userRoleSchema)

const password = {
    current_password: { type: String },
    old_password: { type: Array },
}

/**
 * Represents the details of a user login.
 * @type {Object} UserLoginDetails
 * @property {string} password - The password of the user.
 * @property {number} update_count - The number of times the user login has been updated.
 */
const userLoginSchema = new mongoose.Schema({
    password: password,
    update_count: { type: Number, required: true },
}, { timestamps: true }, { versionKey: false })
/**
 * Mongoose model for user login.
 * @type {UserLoginModel}
 */
const UserLoginModel = mongoose.model("user_login", userLoginSchema)



/**
 * Represents the details of a new doctor.
 * @type {Object} DoctorDetails
 * @property {string} doctor_registration_id - The registration ID of the doctor.
 * @property {string} mbbs_completed_year - The year the doctor completed MBBS.
 * @property {string} doctor_department - The department the doctor belongs to.
 * @property {string} [time_from] - The start time of availability.
 * @property {string} [time_to] - The end time of availability.
 * @property {boolean} is_approved - Indicates if the doctor is approved.
 */
const doctorSchema = new mongoose.Schema({
    doctor_registration_id: { type: String, required: true, unique: true },
    mbbs_completed_year: { type: String, required: true },
    department_id: { type: Number, required: true },
    time_from: { type: String },
    time_to: { type: String },
    is_approved: { type: Boolean, required: true },
}, { timestamps: true }, { versionKey: false })
/**
 * Mongoose model representing doctors.
 * @type {DoctorModel}
 */
const DoctorModel = mongoose.model("doctor", doctorSchema)


/** 
 * Represents a call URL for an appointment.
 * 
 * @property {Object} call_url - The URLs for the appointment call.
 * @property {string} call_url.meetingUrl - The meeting URL.
 * @property {string} call_url.moderatorUrl - The moderator URL.
 */
const callUrl = {
    meetingUrl: { type: String, required: true },
    moderatorUrl: { type: String, required: true },
}
/**
 * Represents the details of a new appointment.
 * 
 * @type {Object} NewAppointmentDetails
 * @property {number} appointment_id - The ID of the appointment.
 * @property {number} client_id - The ID of the client.
 * @property {string} op_id - The ID of the operation.
 * @property {string} billing_id - The ID of the billing.
 * @property {string} usg_ref_id - The reference ID of the USG.
 * @property {number} patient_id - The ID of the patient.
 * @property {number} doctor_id - The ID of the doctor.
 * @property {number} branch_id - The ID of the branch.
 * @property {number} robot_id - The ID of the robot.
 * @property {string} date - The date of the appointment.
 * @property {string} time - The time of the appointment.
 * @property {string} scan_type - The type of scan for the appointment.
 * @property {string} differential_diagnosis - The differential diagnosis for the appointment.
 * @property {string} appointment_status - The status of the appointment.
 * @property {string} appointment_type - The type of appointment.
 * @property {number} created_by - The ID of the user who created the appointment.
 * @property {boolean} is_report_sent - Indicates if the report is sent for the appointment.
 */
const appointmentSchema = new mongoose.Schema({
    appointment_id: { type: Number, unique: true },
    client_id: { type: Number, required: true },
    billing_id: { type: String },
    patient_id: { type: Number, required: true },
    doctor_id: { type: Number, required: true },
    branch_id: { type: Number, required: true },
    robot_id: { type: Number, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    scan_type_id: { type: Number, required: true },
    differential_diagnosis: { type: String, required: true },
    appointment_status: { type: String, required: true },
    appointment_type: { type: String, required: true },
    created_by: { type: Number, required: true },
    action_required: { type: Boolean, required: true }, 
    is_report_sent: { type: Boolean, required: true },
    is_cancelled: { type: Boolean, required: true },
    call_url: callUrl,
}, { timestamps: true }, { versionKey: false })
/**
 * Plugin for auto-incrementing the appointment_id field in the appointmentSchema.
 */
appointmentSchema.plugin(AutoIncrementPlugin, { inc_field: 'appointment_id' })
/**
 * Mongoose model representing appointment.
 * @type {AppointmentModel}
 */
const AppointmentModel = mongoose.model("appointment", appointmentSchema)



/**
 * Represents the details of a health center.
 * 
 * @type {Object} HealthCenterDetails
 * @property {number} branch_id - The branch ID of the health center.
 * @property {number} client_id - The client ID of the health center.
 * @property {string} branch_name - The name of the health center branch.
 * @property {string} branch_contact_number - The contact number of the health center branch.
 * @property {string} branch_location - The location of the health center branch.
 * @property {number} branch_pin_code - The pin code of the health center branch.
 * @property {number[]} system_admin_id - An array of system admin IDs associated with the health center branch.
 * @property {number} created_by - The ID of the user who created the health center branch.
 * @property {Date} createdAt - The timestamp when the health center branch was created.
 * @property {Date} updatedAt - The timestamp when the health center branch was last updated.
 */
const healthCenterSchema = new mongoose.Schema({
    branch_id: { type: Number, unique: true },
    client_id: { type: Number, required: true },
    branch_name: { type: String, required: true },
    branch_contact_number: { type: String, required: true },
    branch_location: { type: String, required: true },
    branch_pin_code: { type: Number, required: true },
    created_by: { type: Number, required: true },
    system_admin_id: { type: Array },
}, { timestamps: true }, { versionKey: false })
/**
 * Plugin to automatically increment the 'branch_id' field in the Health Center schema.
 */
healthCenterSchema.plugin(AutoIncrementPlugin, { inc_field: 'branch_id' })
/**
 * Mongoose model representing a health center.
 *  @type {HealthCenterModel}
 */
const HealthCenterModel = mongoose.model("health_center", healthCenterSchema)


/**
 * Represents the details of a robot.
 * 
 * @type {Object} RobotDetails
 * @property {number} robot_id - The ID of the robot.
 * @property {string} robot_registration_id - The registration ID of the robot.
 * @property {number} branch_id - The ID of the branch the robot belongs to.
 * @property {boolean} under_maintenance - Indicates whether the robot is under maintenance.
 * @property {number} created_by - The ID of the user who created the robot.
 */
const robotSchema = new mongoose.Schema({
    robot_id: { type: Number, unique: true },
    robot_registration_id: { type: String, required: true, unique: true },
    branch_id: { type: Number, required: true },
    under_maintenance: { type: Boolean, required: true },
    created_by: { type: Number, required: true },
}, { timestamps: true }, { versionKey: false })
/**
 * Plugin function to auto-increment a field in a Mongoose schema..
 */
robotSchema.plugin(AutoIncrementPlugin, { inc_field: 'robot_id' })
/**
 * Mongoose model for Robot.
 * @type {RobotModel}
 */
const RobotModel = mongoose.model("robot", robotSchema)



/**
 * Represents the details of an emergency appointment.
 * 
 * @type {Object} EmergencyAppointmentDetails
 * @property {number} emergencyAppointment_id - The ID of the emergency appointment.
 * @property {number} branch_id - The ID of the branch where the appointment is made.
 * @property {number} robot_id - The ID of the robot assigned to the appointment.
 * @property {string} scan_type - The type of scan for the appointment.
 * @property {boolean} is_claimed - Indicates if the appointment is claimed.
 * @property {number} claimed_by - The ID of the user who claimed the appointment.
 * @property {number} created_by - The ID of the user who created the appointment.
 */
const emergencyAppointmentSchema = new mongoose.Schema({
    emergencyAppointment_id: { type: Number, unique: true },
    branch_id: { type: Number, required: true },
    robot_id: { type: Number, required: true },
    scan_type: { type: String, required: true },
    is_claimed: { type: Boolean, required: true },
    claimed_by: { type: Number },
    created_by: { type: Number, required: true },
}, { timestamps: true }, { versionKey: false })
/**
 * Plugin function to auto-increment a field in a Mongoose schema..
 */
emergencyAppointmentSchema.plugin(AutoIncrementPlugin, { inc_field: 'emergencyAppointment_id' })
/**
 * Mongoose model for Emergency appointment.
 * @type {EmergencyAppointmentModel}
 */
const EmergencyAppointmentModel = mongoose.model("emergency_appointment", emergencyAppointmentSchema)



/**
 * Represents the details of a new patient.
 * 
 * @type {Object} PatientDetails
 * @property {number} client_id - The client ID.
 * @property {string} [op_id] - The OP ID (Optional).
 * @property {number} patient_mobile_number - The mobile number of the patient.
 * @property {string} patient_name - The name of the patient.
 * @property {string} [patient_email_id] - The email ID of the patient (Optional).
 * @property {string} patient_gender - The gender of the patient.
 * @property {number} patient_age - The age of the patient.
 * @property {number} patient_pin_code - The pin code of the patient.
 * @property {string} [electronic_id] - The electronic ID of the patient (Optional).
 * @property {boolean} action_required - Indicates if action is required for the patient.
 */
const patientSchema = new mongoose.Schema({
    patient_id: { type: Number, unique: true },
    client_id: { type: Number, required: true },
    op_id: { type: String },
    patient_mobile_number: { type: Number, required: true },
    patient_name: { type: String, required: true },
    patient_email_id: { type: String },
    patient_gender: { type: String, required: true },
    patient_age: { type: Number, required: true },
    patient_pin_code: { type: Number, required: true },
    patient_address: { type: String },
    electronic_id: { type: String },
    action_required: { type: Boolean, required: true },
    created_by: { type: Number, required: true },
}, { timestamps: true }, { versionKey: false })
/**
 * Plugin function to auto-increment a field in a Mongoose schema..
 */
patientSchema.plugin(AutoIncrementPlugin, { inc_field: 'patient_id' })
/**
 * Mongoose model for patient.
 * @type {PatientModel}
 */
const PatientModel = mongoose.model("patient", patientSchema)


/**
 * Represents the details of a user undergoing onboarding for OTP verification.
 * @type {Object} OnBoardingForOTPDetails
 * @property {string} user_email_id - The email id of the user.
 * @property {boolean} is_email_sent - Indicates whether the email for OTP verification has been sent.
 */
const onBoardingSchema = new mongoose.Schema({
    user_email_id: { type: String, required: true },
    is_email_sent: { type: Boolean, required: true },
}, { timestamps: true }, { versionKey: false })
/**
 * Mongoose model for on boarding schema .
 * @type {OnBoardingModel}
 */
const OnBoardingModel = mongoose.model("onBoarding", onBoardingSchema)



/**
 * Represents the details of an OTP.
 * 
 * @type {Object} OTPDetails
 * @property {string} user_email_id - The email id of the user.
 * @property {number} otp - The OTP (One Time Password).
 * @property {Date} expiry_date_time - The expiry date and time of the OTP.
 */
const otpSchema = new mongoose.Schema({
    user_email_id: { type: String, required: true },
    otp: { type: Number, required: true },
    expiry_date_time: { type: Date, required: true }
}, { timestamps: true }, { versionKey: false })
/**
 * Mongoose model for otp .
 */
const OtpModel = mongoose.model("otp", otpSchema)



/**
 * Represents the details of a new report.
 * 
 * @type {Object} ReportDetails
 * @property {number} patient_id - The ID of the patient.
 * @property {number} appointment_id - The ID of the appointment.
 * @property {string} report_details - The details of the report.
 * @property {number} created_by - The ID of the creator of the report.
 * @property {number} view_count - The count of views for the report.
 */
const reportSchema = new mongoose.Schema({
    report_id: { type: Number, unique: true },
    appointment_id: { type: Number, required: true },
    report_details: { type: String, required: true },
    created_by: { type: Number, required: true },
    view_count: { type: Number, required: true },
}, { timestamps: true }, { versionKey: false })
/**
 * Plugin function to auto-increment a field in a Mongoose schema..
 */
reportSchema.plugin(AutoIncrementPlugin, { inc_field: 'report_id' })
/**
 * Mongoose model for report .
 * @type {ReportModel}
 */
const ReportModel = mongoose.model("report", reportSchema)



export default {
    HospitalClientModel, UserModel,
    UserDetailModel, UserRoleModel,
    UserLoginModel, DoctorModel,
    AppointmentModel, HealthCenterModel,
    RobotModel, EmergencyAppointmentModel,
    PatientModel, OnBoardingModel,
    OtpModel, ReportModel
}


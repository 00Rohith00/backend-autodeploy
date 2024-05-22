/**
 * This particular provided data represents hospital specific detail such as hospital_name,
 * logo_url, domain_url, scan_type
 * 
 * @typedef {Object} ClientDetails
 * @property {string} hospital_name - The name of the hospital.
 * @property {string} logo_url - The URL of the hospital's logo.
 * @property {string} domain_url - The domain URL of the hospital.
 * @property {Array.<string>} scan_type - An array of scan types offered by the hospital.
 */
/**
 * Client details object.
 * @type {ClientDetails}
 */
const clientDetails = {
  hospital_name: "St. John's Medical Center",
  logo_url: "https://example.com/stjohns_logo.png",
  domain_url: "www.psg.com",
  scan_type: ["Abdomen", "Ultrasound", "CT"],
  department: ["Radiology"]
}

/**
 * This particular provided data represents the Super Admin, who owns the hospital in this case.
 * 
 * @typedef {Object} SuperAdminDetails
 * @property {string} user_name - The name of the super admin.
 * @property {string} user_email_id - The email ID of the super admin.
 * @property {string} user_contact_number - The contact number of the super admin.
 * @property {string} user_location - The location of the super admin.
 * @property {string} user_pin_code - The pin code of the super admin.
 * @property {null|Object} doctor - The doctor details associated with the super admin (nullable).
 */
/**
 * Super admin details object.
 * @type {SuperAdminDetails}
 */
const superAdminDetails = {
  user_name: 'John',
  user_email_id: 'john@gmail.com',
  user_contact_number: '9129408483',
  user_location: 'london',
  user_pin_code: '349824',
  doctor: null
}

/**
 * This particular provided data represents admin details and who owns an admin for a particular hospital.
 * 
 * @typedef {Object} AdminDetails
 * @property {string} user_name - The name of the admin.
 * @property {string} user_email_id - The email ID of the admin.
 * @property {string} user_contact_number - The contact number of the admin.
 * @property {string} user_location - The location of the admin.
 * @property {string} user_pin_code - The pin code of the admin.
 * @property {null|Object} doctor - The doctor details associated with the admin (nullable).
 */
/**
 * Admin details object.
 * @type {AdminDetails}
 */
const adminDetails = {
  user_name: 'ram',
  user_email_id: 'ram@gmail.com',
  user_contact_number: '9129467801',
  user_location: 'london',
  user_pin_code: '349824',
  doctor: null
}

/**
 * This particular provided data represents system admin details and who owns an system admin for a particular hospital branch.
 * 
 * @typedef {Object} SystemAdminDetails
 * @property {string} user_name - The name of the system admin.
 * @property {string} user_email_id - The email ID of the system admin.
 * @property {string} user_contact_number - The contact number of the system admin.
 * @property {string} user_location - The location of the system admin.
 * @property {string} user_pin_code - The pin code of the system admin.
 * @property {null|Object} doctor - The doctor details associated with the system admin (nullable).
 */
/**
 * System admin details object.
 * @type {SystemAdminDetails}
 */
const systemAdminDetails = {
  user_name: 'siva',
  user_email_id: 'siva@gmail.com',
  user_contact_number: '8229467801',
  user_location: 'london',
  user_pin_code: '349824',
  doctor: null
}

/**
 * This particular provided data represents doctor details.
 * 
 * @typedef {Object} DoctorDetails
 * @property {string} user_name - The name of the doctor.
 * @property {string} user_email_id - The email ID of the doctor.
 * @property {string} user_contact_number - The contact number of the doctor.
 * @property {string} user_location - The location of the doctor.
 * @property {string} user_pin_code - The pin code of the doctor.
 */
/**
 * Doctor details object.
 * @type {DoctorDetails}
 */
const doctorDetails = {
  user_name: 'joe',
  user_email_id: 'joe@gmail.com',
  user_contact_number: '8267894780',
  user_location: 'london',
  user_pin_code: '349824'
}

/**
 * This particular provided data represents a specific details about doctor.
 * 
 * @typedef {Object} OtherDetailsOfDoctor
 * @property {string} mbbs_completed_year - The year the doctor completed MBBS.
 * @property {string} doctor_department - The department of the doctor.
 * @property {string} time_from - The start time of the doctor's availability.
 * @property {string} time_to - The end time of the doctor's availability.
 * @property {boolean} is_approved - Indicates whether the doctor is approved or not.
 */
/**
 * Other details of a doctor object.
 * @type {OtherDetailsOfDoctor}
 */
const otherDetailsOfDoctor = {
  mbbs_completed_year: '1282',
  doctor_department: "ultra sound scanning",
  time_from: '9:00',
  time_to: '6:00',
  is_approved: true
}

/**
 * This particular provided data represents appointment details, for a specific patient, appointment can be created by admin, 
 * system admin and doctor.
 * 
 * @typedef {Object} NewAppointment
 * @property {string} billing_id - The billing ID of the appointment.
 * @property {string} usg_ref_id - The USG reference ID of the appointment.
 * @property {string} date - The date of the appointment.
 * @property {string} time - The time of the appointment.
 * @property {string} scan_type - The type of scan for the appointment.
 * @property {string} differential_diagnosis - The description of the differential diagnosis.
 * @property {string} appointment_status - The status of the appointment.
 * @property {string} appointment_type - The type of appointment.
 * @property {boolean} is_report_sent - Indicates if the report has been sent for the appointment.
 * @property {Object} call_url - The URLs for the meeting and moderator.
 * @property {string} call_url.meetingUrl - The URL for the meeting.
 * @property {string} call_url.moderatorUrl - The URL for the moderator.
 */
/**
 * New appointment object.
 * @type {NewAppointment}
 */
const newAppointment = {
  billing_id: "BILLING-001",
  usg_ref_id: "USG-REF-001",
  date: '2024-01-01',
  time: '2024-04-08T12:00:00',
  scan_type: 'abdomen',
  differential_diagnosis: 'some text',
  appointment_status: 'upcoming',
  appointment_type: 'regular',
  is_report_sent: true,
  call_url: {
    meetingUrl: 'www.meeting/url',
    moderatorUrl: 'www.moderator/url'
  }
}

/**
 * This particular provided data represents a branch details for a each hospital.
 * 
 * @typedef {Object} HealthCenterDetails
 * @property {string} branch_name - The name of the health center branch.
 * @property {string} branch_contact_number - The contact number of the health center branch.
 * @property {string} branch_location - The location of the health center branch.
 * @property {string} branch_pin_code - The pin code of the health center branch.
 */
/**
 * Health center branch details object.
 * @type {HealthCenterDetails}
 */
const healthCenterDetails = {
  branch_name: 'Adaiyar branch',
  branch_contact_number: '123974823',
  branch_location: 'Chennai',
  branch_pin_code: '342342'
}

/**
 * This particular provided data represents a patient details.
 * 
 * @typedef {Object} NewPatientDetails
 * @property {string} patient_mobile_number - The mobile number of the patient.
 * @property {string} patient_name - The name of the patient.
 * @property {string} patient_email_id - The email id of the patient.
 * @property {string} patient_gender - The gender of the patient.
 * @property {string} patient_age - The age of the patient.
 * @property {string} patient_pin_code - The pin code of the patient.
 * @property {string} electronic_id - The electronic id of the patient.
 * @property {boolean} action_required - Indicates if action is required for the patient.
 */
/**
 * New patient details object.
 * @type {NewPatientDetails}
 */
const newPatient = {
  patient_mobile_number: '432534253',
  patient_name: 'mercy',
  patient_email_id: 'mercy@gmail.com',
  patient_gender: 'male',
  patient_age: '23',
  patient_pin_code: '233123',
  electronic_id: '3424',
  action_required: true
}

export default {
  clientDetails, superAdminDetails,
  adminDetails, systemAdminDetails,
  doctorDetails, otherDetailsOfDoctor,
  healthCenterDetails, newPatient,
  newAppointment
}
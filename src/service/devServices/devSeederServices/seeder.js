import seedData from "../../../store/seeder/seed.data.js"

import { collections } from "../../../mongoose/index.mongoose.js"
import { passwordEncryption } from "../../../router/authenticationRouters/authentication.helper.js"
import { returnStatement } from "../../../utils/return.handler.js"

/**
 * Seeds data into various collections in the database. This function takes in a data object containing the data 
 * to be seeded into different collections. It then performs the seeding process, populating the database with the 
 * provided data. Upon successful seeding, it returns a Promise that resolves to an object with a success flag indicating 
 * the success of the seeding process and a corresponding message. If any error occurs during the seeding process, 
 * it throws an Error with details of the error.
 *
 * Additional Notes:
 * This office module, responsible for seeding a data on multiple collections in same time
 * has been developed by our development team and is managed by our dedicated support team.
 * 
 * @param {Object} data - An object containing the data to be seeded into various collections.
 * @return {Promise<Object>} A promise that resolves to an object with a success flag indicating whether the seeding process was successful or not, along with a corresponding message.
 * @throws {Error} If any error occurs during the seeding process, it throws an Error with details of the error.
 */

const seedDataApi = async (data) => {
    try {
        // 1.OFFICE MODULE: 
        // NEW HOSPITAL CLIENT:
        const createNewClient = await collections.HospitalClientModel.create(seedData.clientDetails)
        if (createNewClient._id) console.log("👉 1/27  hospital client is created")
        else throw "hospital client is not created"

        // NEW SUPER ADMIN:
        const superAdminDetails = await collections.UserDetailModel.create(seedData.superAdminDetails)
        if (superAdminDetails._id) console.log("👉 2/27  super admin details are inserted in user_details collection")
        else throw "super admin details are not inserted in user_details collection"

        const superAdminLogin = await collections.UserLoginModel.create({ password: passwordEncryption("1234"), update_count: 1 })
        if (superAdminLogin._id) console.log("👉 3/27  super admin login details are inserted in user_login collection")
        else throw "super admin login details are not inserted in user_login collection"

        const superAdminRole = await collections.UserRoleModel.create({ role_id: 1, role_name: "super_admin" })
        if (superAdminRole._id) console.log("👉 4/27  super admin role details are inserted in user_roles collection")
        else throw "super admin role details are not inserted in user_role collection"

        const newSuperAdmin = await collections.UserModel.create({
            client_id: createNewClient.client_id,
            branch_id: null,
            user_details: superAdminDetails._id,
            user_roles: superAdminRole._id,
            user_login: superAdminLogin._id,
            image_url: 'https://example.com/user1.jpg',
            is_archive: false,
            created_by: null
        })
        if (newSuperAdmin._id) console.log("👉 5/27  super admin is created")
        else throw "super admin is not created"


        // 2.SUPER ADMIN MODULE:
        // NEW ADMIN:
        const adminDetails = await collections.UserDetailModel.create(seedData.adminDetails)
        if (adminDetails._id) console.log("👉 6/27  admin details are inserted in user_details collection")
        else throw "admin details are not inserted in user_details collection"

        const adminLogin = await collections.UserLoginModel.create({ password: passwordEncryption("1234"), update_count: 0 })
        if (adminLogin._id) console.log("👉 7/27  admin login details are inserted in user_login collection")
        else throw "admin login details are not inserted in user_login collection"

        const adminRole = await collections.UserRoleModel.create({ role_id: 2, role_name: "admin" })
        if (adminRole._id) console.log("👉 8/27  admin role details are inserted in user_roles collection")
        else throw "admin role details are not inserted in user_role collection"

        const newAdmin = await collections.UserModel.create({
            client_id: createNewClient.client_id,
            branch_id: null,
            user_details: adminDetails._id,
            user_roles: adminRole._id,
            user_login: adminLogin._id,
            image_url: 'https://example.com/user1.jpg',
            is_archive: false,
            created_by: newSuperAdmin.user_id
        })
        if (newAdmin._id) console.log("👉 9/27  admin is created")
        else throw "admin is not created"


        // NEW HEALTH CENTER:
        const newHealthCenter = await collections.HealthCenterModel.create({ ...seedData.healthCenterDetails, client_id: createNewClient.client_id, created_by: newSuperAdmin.user_id })
        if (newHealthCenter._id) console.log("👉 10/27 health center is created")
        else throw "health center is not created"


        // NEW ROBOT:
        const newRobot = await collections.RobotModel.create({
            robot_registration_id: Date.now(),
            branch_id: newHealthCenter.branch_id,
            under_maintenance: true,
            created_by: newSuperAdmin.user_id
        })
        if (newRobot._id) console.log("👉 11/27 robot is created")
        else throw "robot is not created"



        // 3.ADMIN MODULE:
        // NEW DOCTOR
        const otherDetailsOfDoctor = await collections.DoctorModel.create({ ...seedData.otherDetailsOfDoctor, doctor_registration_id: Date.now() })
        if (otherDetailsOfDoctor._id) console.log("👉 12/27 details inserted into doctor collection")
        else throw "details not inserted in doctor collection"

        const doctorDetails = await collections.UserDetailModel.create({ ...seedData.doctorDetails, doctor: otherDetailsOfDoctor._id })
        if (doctorDetails._id) console.log("👉 13/27 doctor details are inserted in user_details collection")
        else throw "doctor details are not inserted in user_details collection"

        const doctorRole = await collections.UserRoleModel.create({ role_id: 4, role_name: "doctor" })
        if (doctorRole._id) console.log("👉 14/27 doctor role details are inserted in user_roles collection")
        else throw "Doctor role details are not inserted in user_role collection"

        const doctorLogin = await collections.UserLoginModel.create({ password: "5678", update_count: 0 })
        if (doctorLogin._id) console.log("👉 15/27 doctor login details are inserted in user_login collection")
        else throw "doctor login details are not inserted in user_login collection"

        const newDoctor = await collections.UserModel.create({
            client_id: createNewClient.client_id,
            branch_id: null,
            user_details: doctorDetails._id,
            user_roles: doctorRole._id,
            user_login: doctorLogin._id,
            image_url: 'https://example.com/user1.jpg',
            is_archive: false,
            created_by: newAdmin.user_id
        })
        if (newDoctor._id) console.log("👉 16/27 Doctor is created")
        else throw "Doctor is not created"


        // NEW PATIENT:
        const newPatient = await collections.PatientModel.create({ ...seedData.newPatient, op_id: Date.now(), created_by: newAdmin.user_id, client_id: createNewClient.client_id })
        if (newPatient._id) console.log("👉 17/27 patient is created")
        else throw "Patient is not created"


        // NEW SYSTEM ADMIN:
        const systemAdminDetails = await collections.UserDetailModel.create(seedData.systemAdminDetails)
        if (systemAdminDetails._id) console.log("👉 18/27 system admin details are inserted in user_details collection")
        else throw "system admin details are not inserted in user_details collection"

        const systemAdminRole = await collections.UserRoleModel.create({ role_id: 3, role_name: "system admin" })
        if (systemAdminRole._id) console.log("👉 19/27 system admin role details are inserted in user_roles collection")
        else throw "system admin role details are not inserted in user_role collection"

        const systemAdminLogin = await collections.UserLoginModel.create({ password: passwordEncryption("1234"), update_count: 0 })
        if (systemAdminLogin._id) console.log("👉 20/27 system admin login details are inserted in user_login collection")
        else throw "system admin login details are not inserted in user_login collection"

        const branch = await collections.HealthCenterModel.find({ _id: newHealthCenter._id })
        let branchId
        if (branch) branchId = branch[0].branch_id
        else throw "branch is not found"

        const newSystemAdmin = await collections.UserModel.create({
            client_id: newClient.client_id,
            branch_id: branchId,
            user_details: systemAdminDetails._id,
            user_roles: systemAdminRole._id,
            user_login: systemAdminLogin._id,
            image_url: 'https://example.com/user1.jpg',
            is_archive: false,
            created_by: newAdmin.user_id
        })
        if (newSystemAdmin._id) console.log("👉 21/27 system admin is created")
        else throw "system admin is not created"

        const addSystemAdminInBranch = await collections.HealthCenterModel.findOneAndUpdate(
            { _id: newHealthCenter._id },
            { $push: { system_admin_id: newSystemAdmin.user_id } },
            { new: true }
        )
        if (addSystemAdminInBranch) console.log("👉 22/27 System Admin user_id added in health center collection")
        else throw "System Admin user_id is not added in health center collection"


        // NEW APPOINTMENT:
        let patientId, doctorId, robotId

        const patient = await collections.PatientModel.find({ _id: newPatient._id })
        if (patient) patientId = patient[0].patient_id
        else throw "patient is not found"

        const doctor = await collections.UserModel.find({ _id: newDoctor._id })
        if (doctor) doctorId = doctor[0].user_id
        else throw "doctor is not found"

        const robot = await collections.RobotModel.find({ _id: newRobot._id })
        if (robot) robotId = robot[0].robot_id
        else throw "robot is not found"

        const newAppointment = await collections.AppointmentModel.create({
            client_id: newClient.client_id,

            patient_id: patientId,
            doctor_id: doctorId,
            branch_id: branchId,
            robot_id: robotId,
            op_id: "00-90",
            ...seedData.newAppointment,
            created_by: newAdmin.user_id
        })
        if (newAppointment._id) console.log("👉 23/27 appointment created successfully")
        else throw "appointment is not created"


        // EMERGENCY APPOINTMENT:
        const emergencyAppointment = await collections.EmergencyAppointmentModel.create({
            branch_id: branchId,
            robot_id: robotId,
            scan_type: "abdomen",
            is_claimed: true,
            claimed_by: doctorId,
            created_by: newSystemAdmin.user_id,
        })
        if (emergencyAppointment._id) console.log("👉 24/27 emergency Appointment created successfully")
        else throw "emergency Appointment is not created"


        // 4.OTHER COLLECTIONS:
        // ONBOARDING:
        const newOnboarding = await collections.OnBoardingModel.create({ user_email_id: "john@gmail.com", is_email_sent: true })
        if (newOnboarding._id) console.log("👉 25/27 Details inserted in onboarding collection")
        else throw "Details is not inserted in onboarding collection"


        // OTP:
        const otp = await collections.OtpModel.create({ user_email_id: "john@gmail.com", otp: 123345, expiry_date_time: Date.now() })
        if (otp._id) console.log("👉 26/27 Details inserted in OTP collection")
        else throw "Details is not inserted in OTP collection"


        // REPORT:
        const report = await collections.ReportModel.create({
            patient_id: patientId,
            report_details: "report details",
            report_status: "completed",
            created_by: doctorId,
            view_count: 0
        })
        if (report._id) console.log("👉 27/27 Details inserted in report collection")
        else throw "Details is not inserted in report collection"

        return returnStatement(true, 'Data seeded successfully.')

    } catch (error) {
        if (error._message) throw error._message
        else throw error
    }
}

export default { seedDataApi }
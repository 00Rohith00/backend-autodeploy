import { application } from "express"
import { roleId, role } from "../../config/config.js"
import { collections } from "../../mongoose/index.mongoose.js"
import { passwordEncryption } from "../../router/authenticationRouters/authentication.helper.js"
import { clients } from "../../store/seeder/seed.data.js"
import { convertTimeTo24HourFormat } from "../../utils/date.time.js"
import { returnStatement } from "../../utils/return.handler.js"
import { videoCallApi } from "../microServices/video.call.js"

const seedDataApi = async (data) => {

    try {

        const allDetails = []

        for (let indexOfClient = 0; indexOfClient < clients.length; indexOfClient++) {

            const client = clients[indexOfClient]

            const seederDetails = {
                client: {}, superAdmins: [], admins: [], branch: [],
                systemAdmins: [], doctors: [], patients: [], appointments: []
            }

            // NEW HOSPITAL CLIENT:

            const createNewClient = await collections.HospitalClientModel.create(client.clientDetails)

            if (createNewClient._id) { console.log("👉 1/10 hospital client is created") }

            else throw returnStatement(false, "error occurs while creating hospital client")

            seederDetails.client = { client_id: createNewClient.client_id, hospital_name: createNewClient.hospital_name }

            //  NEW SUPER ADMINs:

            for (let indexOfSuperAdmin = 0; indexOfSuperAdmin < client['superAdminDetails'].length; indexOfSuperAdmin++) {

                const [userDetails, roleDetails, loginDetails] = await Promise.all([
                    collections.UserDetailModel.create(client['superAdminDetails'][indexOfSuperAdmin]),
                    collections.UserRoleModel.create({ role_id: roleId.superAdmin, role_name: role.superAdmin }),
                    collections.UserLoginModel.create({ update_count: 1, password: { current_password: passwordEncryption(client['superAdminDetails'][indexOfSuperAdmin].password), old_password: [passwordEncryption(client['superAdminDetails'][indexOfSuperAdmin].password)] } }),
                ])

                const superAdminDetails = await collections.UserModel.create({
                    client_id: createNewClient.client_id,
                    branch_id: null,
                    user_details: userDetails._id,
                    user_roles: roleDetails._id,
                    user_login: loginDetails._id,
                    image_url: client['superAdminDetails'][indexOfSuperAdmin].image_url,
                    is_archive: false,
                    created_by: null
                })

                if (superAdminDetails._id)

                    seederDetails['superAdmins'].push({
                        id: superAdminDetails.user_id,
                        email: client['superAdminDetails'][indexOfSuperAdmin].user_email_id,
                        password: client['superAdminDetails'][indexOfSuperAdmin].password
                    })

                else throw returnStatement(false, "error occurs while creating super admin")
            }

            console.log("👉 2/10 superAdmin is created")



            // NEW ADMINs:

            for (let indexOfAdmin = 0; indexOfAdmin < client['adminDetails'].length; indexOfAdmin++) {

                const [userDetails, roleDetails, loginDetails] = await Promise.all([
                    collections.UserDetailModel.create(client['adminDetails'][indexOfAdmin]),
                    collections.UserRoleModel.create({ role_id: roleId.admin, role_name: role.admin }),
                    collections.UserLoginModel.create({ update_count: 1, password: { current_password: passwordEncryption(client['adminDetails'][indexOfAdmin].password), old_password: [passwordEncryption(client['adminDetails'][indexOfAdmin].password)] } }),
                ])

                let superAdmin = seederDetails['superAdmins'][0].id

                if (indexOfAdmin > 1) superAdmin = seederDetails['superAdmins'][1].id

                const adminDetails = await collections.UserModel.create({
                    client_id: createNewClient.client_id,
                    branch_id: null,
                    user_details: userDetails._id,
                    user_roles: roleDetails._id,
                    user_login: loginDetails._id,
                    image_url: client['adminDetails'][indexOfAdmin].image_url,
                    is_archive: false,
                    created_by: superAdmin
                })

                if (adminDetails._id)

                    seederDetails['admins'].push({
                        id: adminDetails.user_id,
                        email: client['adminDetails'][indexOfAdmin].user_email_id,
                        password: client['adminDetails'][indexOfAdmin].password
                    })

                else throw returnStatement(false, "error occurs while creating admin")
            }

            console.log("👉 3/10 admin is created")



            // NEW BRANCH:

            for (let indexOfBranch = 0; indexOfBranch < client['branchDetails'].length; indexOfBranch++) {

                const createNewHealthCenter = await collections.HealthCenterModel.create({ ...client['branchDetails'][indexOfBranch], client_id: createNewClient.client_id, created_by: seederDetails['superAdmins'][indexOfBranch].id })

                if (createNewHealthCenter._id)

                    seederDetails['branch'].push({
                        branch_id: createNewHealthCenter.branch_id,
                        robots: [],
                        created_by: seederDetails['superAdmins'][indexOfBranch].id
                    })

                else throw returnStatement(false, "error occurs while creating branches")
            }

            console.log("👉 4/10 health center is created")



            // NEW ROBOTs:

            for (let indexOfRobot = 0; indexOfRobot < client['robotDetails'].length; indexOfRobot++) {

                let branchId = seederDetails['branch'][0].branch_id
                let superAdmin = seederDetails['superAdmins'][0].id

                if (indexOfRobot > 1) { branchId = seederDetails['branch'][1].branch_id; superAdmin = seederDetails['superAdmins'][1].id }

                const createNewRobot = await collections.RobotModel.create({ ...client['robotDetails'][indexOfRobot], branch_id: branchId, created_by: superAdmin })

                if (createNewRobot._id) {

                    if (indexOfRobot > 1) seederDetails['branch'][1].robots.push(createNewRobot.robot_id)

                    else seederDetails['branch'][0].robots.push(createNewRobot.robot_id)

                }

                else throw returnStatement(false, "error occurs while robot branches")
            }

            console.log("👉 5/10 robot is created")



            // NEW SYSTEM ADMINs:

            for (let indexOfSystemAdmin = 0; indexOfSystemAdmin < client['systemAdminDetails'].length; indexOfSystemAdmin++) {

                const [userDetails, roleDetails, loginDetails] = await Promise.all([
                    collections.UserDetailModel.create(client['systemAdminDetails'][indexOfSystemAdmin]),
                    collections.UserRoleModel.create({ role_id: roleId.systemAdmin, role_name: role.systemAdmin }),
                    collections.UserLoginModel.create({ update_count: 1, password: { current_password: passwordEncryption(client['systemAdminDetails'][indexOfSystemAdmin].password), old_password: [passwordEncryption(client['systemAdminDetails'][indexOfSystemAdmin].password)] } }),
                ])

                let branchId = seederDetails['branch'][0].branch_id

                if (indexOfSystemAdmin > 1) branchId = seederDetails['branch'][1].branch_id

                const systemAdminDetails = await collections.UserModel.create({
                    client_id: createNewClient.client_id,
                    branch_id: branchId,
                    user_details: userDetails._id,
                    user_roles: roleDetails._id,
                    user_login: loginDetails._id,
                    image_url: client['systemAdminDetails'][indexOfSystemAdmin].image_url,
                    is_archive: false,
                    created_by: seederDetails['admins'][indexOfSystemAdmin].id
                })

                if (systemAdminDetails._id) {

                    await collections.HealthCenterModel.findOneAndUpdate(
                        { branch_id: branchId },
                        { $push: { system_admin_id: systemAdminDetails.user_id } },
                        { new: true }
                    )

                    seederDetails['systemAdmins'].push({
                        id: systemAdminDetails.user_id,
                        email: client['systemAdminDetails'][indexOfSystemAdmin].user_email_id,
                        password: client['systemAdminDetails'][indexOfSystemAdmin].password
                    })
                }
                else throw returnStatement(false, "error occurs while creating system admin")
            }

            console.log("👉 6/10 system admin is created")



            // NEW DOCTORs:

            for (let indexOfDoctor = 0; indexOfDoctor < client['doctorDetails'].length; indexOfDoctor++) {

                const details = await collections.DoctorModel.create({ ...client['doctorDetails'][indexOfDoctor].doctor, department_id: createNewClient['department'][0].id })

                const [userDetails, roleDetails, loginDetails] = await Promise.all([
                    collections.UserDetailModel.create({ ...client['doctorDetails'][indexOfDoctor], doctor: details._id }),
                    collections.UserRoleModel.create({ role_id: roleId.doctor, role_name: role.doctor }),
                    collections.UserLoginModel.create({ update_count: 1, password: { current_password: passwordEncryption(client['doctorDetails'][indexOfDoctor].password), old_password: [passwordEncryption(client['doctorDetails'][indexOfDoctor].password)] } }),
                ])

                const doctorDetails = await collections.UserModel.create({
                    client_id: createNewClient.client_id,
                    branch_id: null,
                    user_details: userDetails._id,
                    user_roles: roleDetails._id,
                    user_login: loginDetails._id,
                    image_url: client['doctorDetails'][indexOfDoctor].image_url,
                    is_archive: false,
                    created_by: seederDetails['admins'][indexOfDoctor].id
                })

                if (doctorDetails._id) {

                    seederDetails['doctors'].push({
                        id: doctorDetails.user_id,
                        email: client['doctorDetails'][indexOfDoctor].user_email_id,
                        password: client['doctorDetails'][indexOfDoctor].password
                    })
                }
                else throw returnStatement(false, "error occurs while creating doctor")
            }

            console.log("👉 7/10 doctor is created")



            // NEW PATIENTs:

            for (let indexOfPatient = 0; indexOfPatient < client['patientDetails'].length; indexOfPatient++) {

                if (indexOfPatient < 4) {
                    const patient = await collections.PatientModel.create({ ...client['patientDetails'][indexOfPatient], client_id: createNewClient.client_id, created_by: seederDetails['admins'][indexOfPatient].id })
                    seederDetails['patients'].push({ patient_id: patient.patient_id, patient_name: patient.patient_name, op_id: patient.op_id })
                }
                else {
                    const patient = await collections.PatientModel.create({ ...client['patientDetails'][indexOfPatient], client_id: createNewClient.client_id, created_by: seederDetails['systemAdmins'][indexOfPatient - 4].id })
                    seederDetails['patients'].push({ patient_id: patient.patient_id, patient_name: patient.patient_name, op_id: patient.op_id })
                }
            }

            console.log("👉 8/10 patient is created")



            // NEW APPOINTMENTs: 

            for (let indexOfAppointment = 0; indexOfAppointment < client['appointmentDetails'].length; indexOfAppointment++) {


                const conferenceInfo = {
                    owner: "Rohith",
                    appointment_date: client['appointmentDetails'][indexOfAppointment].date,
                    appointment_time: convertTimeTo24HourFormat(client['appointmentDetails'][indexOfAppointment].time)
                }

                const appointmentDetails = {

                    client_id: createNewClient.client_id,
                    patient_id: seederDetails['patients'][indexOfAppointment].patient_id,
                    doctor_id: seederDetails['doctors'][0].id,
                    branch_id: seederDetails['branch'][0].branch_id,
                    robot_id: seederDetails['branch'][0].robots[0],
                    scan_type_id: createNewClient['scan_type'][0].id,
                    action_required: false,
                    call_url: await videoCallApi(conferenceInfo)    
                }

                if (indexOfAppointment < 4) {

                    const appointment = await collections.AppointmentModel.create({ ...appointmentDetails, ...client['appointmentDetails'][indexOfAppointment], created_by: seederDetails['admins'][indexOfAppointment].id })

                    seederDetails['appointments'].push({ appointment_id: appointment.appointment_id, patient_id: appointment.patient_id, date: client['appointmentDetails'][indexOfAppointment].date, billing_id: client['appointmentDetails'][indexOfAppointment].billing_id })
                }
                else {

                    const appointment = await collections.AppointmentModel.create({ ...appointmentDetails, ...client['appointmentDetails'][indexOfAppointment], created_by: seederDetails['systemAdmins'][indexOfAppointment - 4].id })

                    seederDetails['appointments'].push({ appointment_id: appointment.appointment_id, patient_id: appointment.patient_id, date: client['appointmentDetails'][indexOfAppointment].date, billing_id: client['appointmentDetails'][indexOfAppointment].billing_id })
                }

            }

            console.log("👉 9/10 appointment is created")



            // REPORT:


            for (let indexOfReport = 0; indexOfReport < 8; indexOfReport++) {

                await collections.ReportModel.create({appointment_id: seederDetails['appointments'][indexOfReport].appointment_id, report_details: "here is the detail of reports", created_by: seederDetails['doctors'][0].id, view_count: 0})
            }

            console.log("👉 10/10 report is created")

            allDetails.push(seederDetails)
        }

        return returnStatement(true, "seeded information", allDetails)

    }
    catch (error) {
        if (error.status == false && error.message) { throw error.message }
        else { throw error._message ? error._message : "Error while deleting all the data in mongoose db" }
    }

}

/**
 * Developers clears all documents from multiple collections in the database. This function performs a bulk deletion operation
 * on multiple collections, removing all documents within each collection. 
 * 
 * Additional Notes:
 * This office module, responsible for deletion, a bulk deletion operation on multiple collections 
 * has been developed by our development team and is managed by our dedicated support team.
 * 
 * @function clearDataApi
 * @returns {Promise<Object>} A Promise that resolves to an object containing the status of the operation and a corresponding message.
 * If the data is cleared successfully from all collections, the status is true and the message is "Data cleared successfully."
 * If there is an error while deleting the data from any of the collections, the status is false and the message is 
 * "Error while deleting all the data in mongoose db".
 */

const clearDataApi = async (data) => {
    try {

        // Remove all documents from the collection
        await collections.HospitalClientModel.deleteMany({})
        await collections.AppointmentModel.deleteMany({})

        await collections.DoctorModel.deleteMany({})
        await collections.EmergencyAppointmentModel.deleteMany({})

        await collections.HealthCenterModel.deleteMany({})
        await collections.OnBoardingModel.deleteMany({})

        await collections.OtpModel.deleteMany({})
        await collections.PatientModel.deleteMany({})

        await collections.ReportModel.deleteMany({})
        await collections.RobotModel.deleteMany({})

        await collections.UserDetailModel.deleteMany({})
        await collections.UserLoginModel.deleteMany({})

        await collections.UserModel.deleteMany({})
        await collections.UserRoleModel.deleteMany({})

        return returnStatement(true, "Data cleared successfully.")

    }
    catch (error) { throw "Error while deleting all the data in mongoose db" }
}

export default { seedDataApi, clearDataApi }
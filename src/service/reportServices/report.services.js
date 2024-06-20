
import { role } from "../../config/config.js"
import { collections } from "../../mongoose/index.mongoose.js"
import { returnStatement } from "../../utils/return.handler.js"



const patientReportApi = async (data) => {

    try {

        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id, is_archive: false }, { _id: 0, client_id: 1 })

        const appointment = await collections.AppointmentModel.findOne({ appointment_id: data.body.appointment_id, client_id: userDetails.client_id, is_cancelled: false })

        if (userDetails && appointment && data.body.role_name == role.doctor) {

            if (appointment.client_id != userDetails.client_id) throw returnStatement(false, "appointment id not found")

            if (data.route.path.includes('/create-new-report')) {

                const reportCollection = await collections.ReportModel.findOne({ appointment_id: data.body.appointment_id })

                if (reportCollection) throw returnStatement(false, "report already created for this appointment")

                const addReport = await collections.ReportModel.create({
                    appointment_id: data.body.appointment_id,
                    report_details: data.body.report_details,
                    created_by: data.body.user_id,
                    view_count: 0
                })

                if (addReport._id) { return returnStatement(true, "Report is created") }

                else { throw error }
            }
            else if (data.route.path.includes('/edit-report')) {

                const editReport = await collections.ReportModel.findOneAndUpdate(
                    { appointment_id: data.body.appointment_id },
                    { $set: { report_details: data.body.report_details } },
                    { new: true }
                )

                if(editReport) return returnStatement(true, "report is updated")

                else throw returnStatement(false, "report not found for this appointment")
                
            }
        }
        else {
            throw returnStatement(false, !userDetails ? "user id is not found" :
                !appointment ? "appointment id not found" : `${data.body.role_name} not able to update patient reports`)
        }
    }
    catch (error) {
        if (error.status == false && error.message) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}


const listOfReportsApi = async (data) => {

    try {

        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id, is_archive: false }, { _id: 0, client_id: 1 })

        if (userDetails && data.body.role_name != role.superAdmin) {

            const appointments = await collections.AppointmentModel
                .find({ client_id: userDetails.client_id, is_cancelled: false },
                    { appointment_id: 1, scan_type_id: 1, doctor_id: 1, patient_id: 1, _id: 0, is_report_sent: 1 })

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

                const clientDetails = await collections.HospitalClientModel.findOne({ client_id: userDetails.client_id })

                let scanType = ""

                clientDetails['scan_type'].forEach((scan) => {

                    if (scan.id == appointment.scan_type_id) scanType = scan.scan_type

                })

                const requiredFields = {
                    appointment_id: appointment.appointment_id,
                    scan_type: scanType,
                    report_status: appointment.is_report_sent,
                    doctor_name: doctorName._doc.user_details._doc.user_name,
                    patient_name: patientName.patient_name
                }
                listOfAppointments.push(requiredFields)
            }
            return returnStatement(true, `list of reports`, listOfAppointments)
        }

        else {
            throw returnStatement(false,
                !userDetails ? "user id is not found" :
                    `${data.body.role_name} can't able to view list of report`)
        }
    }
    catch (error) {
        if (error.status == false && error.message) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}


const addReportTemplateApi = async (data) => {

    try {

        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id, is_archive: false }, { _id: 0, client_id: 1 })

        if (userDetails && (data.body.role_name == role.doctor || data.body.role_name == role.admin)) {

            const clientDetails = await collections.HospitalClientModel.findOne({ client_id: userDetails.client_id })

            clientDetails['templates'].forEach((template) => {
                if (template.template_name == data.body.template_name && template.is_archive == false) throw returnStatement(false, "given template is already exist")
            })

            await collections.HospitalClientModel.findOneAndUpdate(
                { client_id: userDetails.client_id },
                { $push: { templates: { id: `${Date.now()}`, template_name: data.body.template_name, template: data.body.template, is_archive: false } } },
                { new: true }
            )
            return returnStatement(true, "template is added")
        }
        else {
            throw returnStatement(false,
                !userDetails ? "user id is not found" :
                    `${data.body.role_name} can't able to add new report template`)
        }

    }
    catch (error) {
        if (error.status == false && error.message) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}


const deleteReportTemplateApi = async (data) => {

    try {

        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id, is_archive: false }, { _id: 0, client_id: 1 })

        if (userDetails && (data.body.role_name == role.doctor || data.body.role_name == role.admin)) {

            const clientDetails = await collections.HospitalClientModel.findOne({ client_id: userDetails.client_id })

            const promises = clientDetails['templates'].map(async (template) => {

                if (template.id == data.body.template_id && template.is_archive == false) {
                    await collections.HospitalClientModel.findOneAndUpdate(
                        { client_id: userDetails.client_id },
                        { $pull: { templates: { id: template.id } } },
                        { new: true }
                    )

                    await collections.HospitalClientModel.findOneAndUpdate(
                        { client_id: userDetails.client_id },
                        { $push: { templates: {id: template.id, template_name: template.template_name, template: template.template ,is_archive: true} } },
                        { new: true }
                    )
                    return true
                }
            })

            const isDeleted = await Promise.all(promises).then(results => { return results.includes(true) })

            if (isDeleted) return returnStatement(true, "template is deleted")

            else throw returnStatement(false, "given template is not found")
        }

        else {
            throw returnStatement(false,
                !userDetails ? "user id is not found" :
                    `${data.body.role_name} can't able to delete report template`)
        }
    }
    catch (error) {
        if (error.status == false && error.message) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}


const listOfReportTemplatesApi = async (data) => {

    try {

        const userDetails = await collections.UserModel.findOne({ user_id: data.body.user_id, is_archive: false }, { _id: 0, client_id: 1 })

        if (userDetails && (data.body.role_name == role.doctor || data.body.role_name == role.admin)) {

            const clientDetails = await collections.HospitalClientModel.findOne({ client_id: userDetails.client_id }, { _id: 0, templates: 1 })

            let listOfTemplates = []

            clientDetails['templates'].forEach((template) => {
                if (template.is_archive == false)
                    listOfTemplates.push({ id: template.id, template: template.template, template_name: template.template_name })
            })

            return returnStatement(true, "list of templates", listOfTemplates)
        }

        else {
            throw returnStatement(false,
                !userDetails ? "user id is not found" :
                    `${data.body.role_name} can't able to view list of report template`)
        }
    }
    catch (error) {
        if (error.status == false && error.message) { throw error.message }
        else { throw error._message ? error._message : "internal server error" }
    }
}



export default {
    patientReportApi, listOfReportsApi, addReportTemplateApi, listOfReportTemplatesApi, deleteReportTemplateApi
}
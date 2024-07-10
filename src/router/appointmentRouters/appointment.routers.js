import express from "express"
import middleware from "./import.js"
import controller from "../../controller/appointmentControllers/appointment.controllers.js"

const appointmentRouters = express.Router()



//post routers
appointmentRouters.post('/create-new-appointment', middleware.createNewAppointmentApi, controller.createNewAppointmentApi)
appointmentRouters.post('/search-patient-information', middleware.searchPatientInformationApi, controller.searchPatientInformationApi)

appointmentRouters.post('/edit-appointment', middleware.editAppointmentApi, controller.editAppointmentApi)
appointmentRouters.post('/reschedule-appointment', middleware.rescheduleAppointmentApi, controller.rescheduleAppointmentApi)
appointmentRouters.post('/appointment-details', middleware.appointmentDetailsApi, controller.appointmentDetailsApi)
appointmentRouters.post('/cancel-appointment', middleware.cancelAppointmentApi, controller.cancelAppointmentApi)

appointmentRouters.post('/list-of-health-centers', middleware.listOfHealthCenterApi, controller.listOfHealthCenterApi)
appointmentRouters.post('/list-of-hospital-doctors', middleware.listOfHospitalDoctorsApi, controller.listOfHospitalDoctorsApi)
appointmentRouters.post('/list-of-hospital-robots', middleware.listOfHospitalRobotsApi, controller.listOfHospitalRobotsApi)
appointmentRouters.post('/list-of-hospital-appointments', middleware.listOfHospitalAppointmentsApi, controller.listOfHospitalAppointmentsApi)
appointmentRouters.post('/list-of-scan-types', middleware.listOfScanTypesApi, controller.listOfScanTypesApi)


export default appointmentRouters
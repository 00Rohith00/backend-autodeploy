import { apiLogger } from "../../middleware/generalMiddleware/api.logger.js"
import { tokenVerification } from "../../middleware/jsonWebToken/jwt.js"


//appointment router imports
const appointmentRouterCommonMiddlewares = [apiLogger, tokenVerification]

const searchPatientInformationApi = [...appointmentRouterCommonMiddlewares,]
const createNewAppointmentApi = [...appointmentRouterCommonMiddlewares,]
const appointmentDetailsApi = [...appointmentRouterCommonMiddlewares,]

const editAppointmentApi = [...appointmentRouterCommonMiddlewares,]
const rescheduleAppointmentApi = [...appointmentRouterCommonMiddlewares,]
const cancelAppointmentApi = [...appointmentRouterCommonMiddlewares,]

const listOfHospitalAppointmentsApi = [...appointmentRouterCommonMiddlewares,]
const listOfHospitalRobotsApi = [...appointmentRouterCommonMiddlewares,]
const listOfHealthCenterApi = [...appointmentRouterCommonMiddlewares,]
const listOfHospitalDoctorsApi = [...appointmentRouterCommonMiddlewares,]
const listOfScanTypesApi = [...appointmentRouterCommonMiddlewares,]

export default {
    searchPatientInformationApi, listOfHospitalRobotsApi,
    listOfHealthCenterApi, listOfHospitalDoctorsApi,
    listOfScanTypesApi, createNewAppointmentApi,
    cancelAppointmentApi, listOfHospitalAppointmentsApi,
    appointmentDetailsApi, rescheduleAppointmentApi,
    editAppointmentApi
}
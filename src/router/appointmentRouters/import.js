import { apiLogger } from "../../middleware/generalMiddleware/api.logger.js"
import { tokenVerification } from "../../middleware/jsonWebToken/jwt.js"
import validation from '../../middleware/validationSchema/validator.schema.js'

//appointment router imports
const appointmentRouterCommonMiddlewares = [apiLogger, tokenVerification]

const searchPatientInformationApi = [...appointmentRouterCommonMiddlewares, validation.searchPatientInformationApi]
const listOfScanTypesApi = [...appointmentRouterCommonMiddlewares]
const listOfHospitalDoctorsApi = [...appointmentRouterCommonMiddlewares]
const listOfHealthCenterApi = [...appointmentRouterCommonMiddlewares]
const listOfHospitalRobotsApi = [...appointmentRouterCommonMiddlewares, validation.listOfHospitalRobotsApi]
const createNewAppointmentApi = [...appointmentRouterCommonMiddlewares, validation.createNewAppointmentApi]
const appointmentDetailsApi = [...appointmentRouterCommonMiddlewares, validation.appointmentDetailsApi]
const cancelAppointmentApi = [...appointmentRouterCommonMiddlewares, validation.appointmentDetailsApi]
const editAppointmentApi = [...appointmentRouterCommonMiddlewares, validation.editAppointmentApi]
const rescheduleAppointmentApi = [...appointmentRouterCommonMiddlewares, validation.rescheduleAppointmentApi]
const listOfHospitalAppointmentsApi = [...appointmentRouterCommonMiddlewares, validation.listOfHospitalAppointmentsApi]


export default {
    searchPatientInformationApi, listOfScanTypesApi, listOfHospitalDoctorsApi, 
    listOfHealthCenterApi, listOfHospitalRobotsApi, createNewAppointmentApi,
    appointmentDetailsApi, cancelAppointmentApi, editAppointmentApi, listOfHospitalAppointmentsApi,
    rescheduleAppointmentApi
}
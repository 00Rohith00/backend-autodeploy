import { apiLogger } from "../../middleware/generalMiddleware/api.logger.js"
import { tokenVerification } from "../../middleware/jsonWebToken/jwt.js"

import validation from '../../middleware/validationSchema/validator.schema.js'

//appointment router imports
const appointmentRouterCommonMiddlewares = [apiLogger, tokenVerification]

const createNewAppointmentApi = [...appointmentRouterCommonMiddlewares, validation.createNewAppointmentApi]
const searchPatientInformationApi = [...appointmentRouterCommonMiddlewares, validation.searchPatientInformationApi]

const editAppointmentApi = [...appointmentRouterCommonMiddlewares, validation.editAppointmentApi]
const appointmentDetailsApi = [...appointmentRouterCommonMiddlewares, validation.appointmentDetailsApi]
const rescheduleAppointmentApi = [...appointmentRouterCommonMiddlewares, validation.rescheduleAppointmentApi]
const cancelAppointmentApi = [...appointmentRouterCommonMiddlewares, validation.appointmentDetailsApi]

const listOfHospitalAppointmentsApi = [...appointmentRouterCommonMiddlewares, validation.listOfHospitalAppointmentsApi]
const listOfHospitalRobotsApi = [...appointmentRouterCommonMiddlewares, validation.listOfHospitalRobotsApi]
const listOfScanTypesApi = [...appointmentRouterCommonMiddlewares]
const listOfHospitalDoctorsApi = [...appointmentRouterCommonMiddlewares]
const listOfHealthCenterApi = [...appointmentRouterCommonMiddlewares]


export default {
    searchPatientInformationApi, listOfScanTypesApi,
    listOfHospitalDoctorsApi, listOfHealthCenterApi,
    listOfHospitalRobotsApi, createNewAppointmentApi,
    appointmentDetailsApi, cancelAppointmentApi,
    editAppointmentApi, listOfHospitalAppointmentsApi,
    rescheduleAppointmentApi
}
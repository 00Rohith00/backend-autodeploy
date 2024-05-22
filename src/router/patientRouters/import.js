import { apiLogger } from "../../middleware/generalMiddleware/api.logger.js"
import { tokenVerification } from "../../middleware/jsonWebToken/jwt.js"

import validation from "../../middleware/validationSchema/validator.schema.js"

// super admin router imports
const patientCommonMiddlewares = [apiLogger, tokenVerification]

const createNewPatientsApi = [...patientCommonMiddlewares, validation.createNewPatientsApi]
const patientDetailsApi = [...patientCommonMiddlewares, validation.patientDetailsApi]
const editPatientDetailsApi = [...patientCommonMiddlewares, validation.editPatientDetailsApi]

const listOfPatientsApi = [...patientCommonMiddlewares]
const previousHistoryApi = [...patientCommonMiddlewares,]

export default {
  createNewPatientsApi, listOfPatientsApi,
  patientDetailsApi, previousHistoryApi,
  editPatientDetailsApi, editPatientDetailsApi
}

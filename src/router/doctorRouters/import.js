import validation from "../../middleware/validationSchema/validator.schema.js"

import { apiLogger } from "../../middleware/generalMiddleware/api.logger.js"
import { tokenVerification } from "../../middleware/jsonWebToken/jwt.js"


//doctor router imports
const doctorRouterCommonMiddlewares = [apiLogger, tokenVerification]

const listOfDoctorsApi = [...doctorRouterCommonMiddlewares]
const listOfDepartmentsApi = [...doctorRouterCommonMiddlewares]
const doctorDetailsApi = [...doctorRouterCommonMiddlewares, validation.doctorDetailsApi]
const editDoctorDetailsApi = [...doctorRouterCommonMiddlewares, validation.editDoctorDetailsApi]

export default {
  listOfDoctorsApi, doctorDetailsApi,
  editDoctorDetailsApi, listOfDepartmentsApi
}


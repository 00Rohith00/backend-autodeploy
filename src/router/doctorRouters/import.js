import { apiLogger } from "../../middleware/generalMiddleware/api.logger.js"
import { tokenVerification } from "../../middleware/jsonWebToken/jwt.js"
import validation from "../../middleware/validationSchema/validator.schema.js"

//doctor router imports
const doctorRouterCommonMiddlewares = [apiLogger, tokenVerification]

const listOfDoctorsApi = [...doctorRouterCommonMiddlewares]
const doctorDetailsApi = [...doctorRouterCommonMiddlewares, validation.doctorDetailsApi]
const editDoctorDetailsApi = [...doctorRouterCommonMiddlewares, validation.editDoctorDetailsApi]
const listOfDepartmentsApi = [...doctorRouterCommonMiddlewares]

export default { listOfDoctorsApi, doctorDetailsApi, editDoctorDetailsApi, listOfDepartmentsApi }


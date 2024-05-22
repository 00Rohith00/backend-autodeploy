import { apiLogger } from "../../middleware/generalMiddleware/api.logger.js"
import { tokenVerification } from "../../middleware/jsonWebToken/jwt.js"

import validation from "../../middleware/validationSchema/validator.schema.js"

const adminCommonMiddlewares = [apiLogger, tokenVerification]

const createNewSystemAdminApi = [...adminCommonMiddlewares, validation.createNewUserApi]
const createNewDoctorApi = [...adminCommonMiddlewares, validation.createNewUserApi]

export default {
  createNewSystemAdminApi, createNewDoctorApi
}
import { apiLogger } from "../../middleware/generalMiddleware/api.logger.js"
import validation from "../../middleware/validationSchema/validator.schema.js"

//office router imports
const officeRouterCommonMiddlewares = [apiLogger]

const createNewClientApi = [...officeRouterCommonMiddlewares, validation.createNewClientApi]
const createNewSuperAdminApi = [...officeRouterCommonMiddlewares, validation.createNewUserApi]

export default {
  createNewClientApi, createNewSuperAdminApi
}
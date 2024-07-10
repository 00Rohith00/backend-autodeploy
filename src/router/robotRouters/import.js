import { apiLogger } from "../../middleware/generalMiddleware/api.logger.js"
import { tokenVerification } from "../../middleware/jsonWebToken/jwt.js"

import validation from '../../middleware/validationSchema/validator.schema.js'


// robot router imports
const robotCommonMiddlewares = [apiLogger, tokenVerification]

const listOfRobotsApi = [...robotCommonMiddlewares]
const robotMaintenanceStatusApi = [...robotCommonMiddlewares, validation.robotMaintenanceStatusApi]


export default {
  listOfRobotsApi, robotMaintenanceStatusApi
}


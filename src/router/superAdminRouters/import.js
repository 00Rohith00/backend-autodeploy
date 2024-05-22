import { apiLogger } from "../../middleware/generalMiddleware/api.logger.js"
import { tokenVerification } from "../../middleware/jsonWebToken/jwt.js"

import validation from "../../middleware/validationSchema/validator.schema.js"

// super admin router imports
const superAdminCommonMiddlewares = [apiLogger, tokenVerification]

const createNewAdminApi = [...superAdminCommonMiddlewares, validation.createNewUserApi]
const createNewHealthCenterApi = [...superAdminCommonMiddlewares, validation.createNewHealthCenterApi]
const createNewRobotApi = [...superAdminCommonMiddlewares, validation.createNewRobotApi]
const addNewScanApi = [...superAdminCommonMiddlewares, validation.scanType]
const deleteScanApi = [...superAdminCommonMiddlewares, validation.scanType]
const addNewDepartmentApi = [...superAdminCommonMiddlewares, validation.department]
const deleteDepartmentApi = [...superAdminCommonMiddlewares, validation.department]

export default {
    createNewAdminApi, createNewHealthCenterApi, createNewRobotApi,
    addNewScanApi, deleteScanApi, addNewDepartmentApi, deleteDepartmentApi
}
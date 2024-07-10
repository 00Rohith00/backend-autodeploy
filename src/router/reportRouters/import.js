import { tokenVerification } from "../../middleware/jsonWebToken/jwt.js"
import { apiLogger } from "../../middleware/generalMiddleware/api.logger.js"
import validation from "../../middleware/validationSchema/validator.schema.js"

// super admin router imports
const reportCommonMiddlewares = [apiLogger, tokenVerification]

const patientReportApi = [...reportCommonMiddlewares, validation.patientReportApi]
const addReportTemplateApi = [...reportCommonMiddlewares, validation.addReportTemplateApi]
const deleteReportTemplateApi = [...reportCommonMiddlewares, validation.deleteReportTemplateApi]

const listOfReportsApi = [...reportCommonMiddlewares]
const listOfReportTemplatesApi = [...reportCommonMiddlewares]

export default {
  patientReportApi, listOfReportsApi,
  addReportTemplateApi, listOfReportTemplatesApi,
  deleteReportTemplateApi
}


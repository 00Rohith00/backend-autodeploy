import { apiLogger } from "../../middleware/generalMiddleware/api.logger.js"
import validation from '../../middleware/validationSchema/validator.schema.js'

//authentication router imports
const authenticationROuterCommonMiddlewares = [apiLogger]      

const isExistingUserApi = [...authenticationROuterCommonMiddlewares, validation.isExistingUserApi]
const setPasswordApi = [...authenticationROuterCommonMiddlewares, validation.setPasswordApi]
const userLoginApi = [...authenticationROuterCommonMiddlewares, validation.loginApi]

const sendOtpApi = [...authenticationROuterCommonMiddlewares, validation.isExistingUserApi]
const verifyOtpApi = [...authenticationROuterCommonMiddlewares, validation.verifyOptApi]


export default {
  isExistingUserApi, setPasswordApi,
  userLoginApi, sendOtpApi, verifyOtpApi
}
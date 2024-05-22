import { apiLogger } from "../../middleware/generalMiddleware/api.logger.js"
import validation from '../../middleware/validationSchema/validator.schema.js'


const isExistingUserApi = [apiLogger, validation.isExistingUserApi]
const setPasswordApi = [apiLogger, validation.setPasswordApi]
const userLoginApi = [apiLogger, validation.loginApi]
const sendOtpApi = [apiLogger, validation.isExistingUserApi]
const verifyOtpApi = [apiLogger, validation.verifyOptApi]


export default {
  isExistingUserApi, setPasswordApi,
  userLoginApi, sendOtpApi, verifyOtpApi  
}
import express from "express"
import middleware from "./import.js"
import controller from "../../controller/authenticationControllers/authentication.controllers.js"

const authRouters = express.Router()

//post routers
authRouters.post("/is-existing-user", middleware.isExistingUserApi, controller.isExistingUserApi)
authRouters.post("/set-password", middleware.setPasswordApi, controller.setPasswordApi)
authRouters.post("/user-login", middleware.userLoginApi, controller.userLoginApi)

authRouters.post("/send-otp", middleware.sendOtpApi, controller.sendOtpApi)
authRouters.post("/verify-otp", middleware.verifyOtpApi, controller.verifyOtpApi)

export default authRouters
import express from "express"
import middleware from "../adminRouters/import.js"
import controller from "../../controller/adminControllers/admin.controllers.js"

const adminRouters = express.Router()

//post routers
adminRouters.post("/create-new-system-admin", middleware.createNewSystemAdminApi, controller.createNewSystemAdminApi)
adminRouters.post("/create-new-doctor", middleware.createNewDoctorApi, controller.createNewDoctorApi)

export default adminRouters
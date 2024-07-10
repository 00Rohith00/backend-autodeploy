import express from "express"
import middleware from "./imports.js"
import controller from '../../controller/officeControllers/office.controllers.js'

const officeRouters = express.Router()
//post routers
officeRouters.post("/create-new-client", middleware.createNewClientApi, controller.createNewClientApi)
officeRouters.post("/create-new-super-admin", middleware.createNewSuperAdminApi, controller.createNewSuperAdminApi)

export default officeRouters
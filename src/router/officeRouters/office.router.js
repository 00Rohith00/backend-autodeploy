import { router } from "../../../server.js"

import middleware from "./imports.js"
import controller from '../../controller/officeControllers/office.controllers.js'

const officeRouters = router

//post routers
officeRouters.post("/create-new-client", middleware.createNewClientApi, controller.createNewClientApi)
officeRouters.post("/create-new-super-admin", middleware.createNewSuperAdminApi, controller.createNewSuperAdminApi)

export default officeRouters
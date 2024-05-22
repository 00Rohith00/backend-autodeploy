import { router } from "../../../server.js"

import middleware from "./import.js"
import controller from "../../controller/superAdminControllers/super.admin.controllers.js"

const superAdminRouters = router

// post routers
superAdminRouters.post('/create-new-admin', middleware.createNewAdminApi, controller.createNewAdminApi)
superAdminRouters.post('/create-new-health-center', middleware.createNewHealthCenterApi, controller.createNewHealthCenterApi)
superAdminRouters.post('/create-new-robot', middleware.createNewRobotApi, controller.createNewRobotApi)
superAdminRouters.post("/add-new-scan", middleware.addNewScanApi, controller.addNewScanApi)
superAdminRouters.delete("/delete-scan", middleware.deleteScanApi, controller.deleteScanApi)
superAdminRouters.post("/add-new-department", middleware.addNewDepartmentApi, controller.addNewDepartmentApi)
superAdminRouters.delete("/delete-department", middleware.deleteDepartmentApi, controller.deleteDepartmentApi)

export default superAdminRouters
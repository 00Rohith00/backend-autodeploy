import express from "express"
import middleware from "./import.js"
import controller from "../../controller/superAdminControllers/super.admin.controllers.js"

const superAdminRouters = express.Router()

// post routers
superAdminRouters.post('/create-new-admin', middleware.createNewAdminApi, controller.createNewAdminApi)
superAdminRouters.post('/create-new-health-center', middleware.createNewHealthCenterApi, controller.createNewHealthCenterApi)
superAdminRouters.post('/create-new-robot', middleware.createNewRobotApi, controller.createNewRobotApi)
superAdminRouters.post("/add-new-scan", middleware.addNewScanApi, controller.addNewScanApi)
superAdminRouters.post("/add-new-department", middleware.addNewDepartmentApi, controller.addNewDepartmentApi)

//delete routers
superAdminRouters.delete("/delete-scan", middleware.deleteScanApi, controller.deleteScanApi)
superAdminRouters.delete("/delete-department", middleware.deleteDepartmentApi, controller.deleteDepartmentApi)

export default superAdminRouters

import middleware from "./import.js"
import controller from "../../controller/robotControllers/robot.controllers.js"
import { router } from "../../../server.js"

const robotRouters = router

//post routers
robotRouters.post('/list-of-robots', middleware.listOfRobotsApi, controller.listOfRobotsApi)
robotRouters.post('/robot-maintenance-status', middleware.robotMaintenanceStatusApi, controller.robotMaintenanceStatusApi)

export default robotRouters


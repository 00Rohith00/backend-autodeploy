import express from "express"
import middleware from "./import.js"
import controller from "../../controller/robotControllers/robot.controllers.js"

const robotRouters = express.Router()

//post routers
robotRouters.post('/list-of-robots', middleware.listOfRobotsApi, controller.listOfRobotsApi)
robotRouters.post('/robot-maintenance-status', middleware.robotMaintenanceStatusApi, controller.robotMaintenanceStatusApi)

export default robotRouters


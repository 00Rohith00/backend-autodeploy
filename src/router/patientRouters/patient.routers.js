import express from "express"
import middleware from "./import.js"
import controller from "../../controller/patientControllers/patient.controllers.js"

const patientRouters = express.Router() 

//post routers
patientRouters.post('/create-new-patient', middleware.createNewPatientsApi, controller.createNewPatientsApi)
patientRouters.post('/edit-patient-details', middleware.editPatientDetailsApi, controller.editPatientDetailsApi)
patientRouters.post('/list-of-patients', middleware.listOfPatientsApi, controller.listOfPatientsApi)
patientRouters.post('/previous-history', middleware.previousHistoryApi, controller.previousHistoryApi)

export default patientRouters
import express from "express"
import middleware from "./import.js"
import controller from "../../controller/reportControllers/report.controllers.js"

const reportRouters = express.Router()

//post routers
reportRouters.post('/create-new-report', middleware.patientReportApi, controller.patientReportApi)
reportRouters.post('/add-report-template', middleware.addReportTemplateApi, controller.addReportTemplateApi)
reportRouters.post('/edit-report', middleware.patientReportApi, controller.patientReportApi)

reportRouters.post('/list-of-reports', middleware.listOfReportsApi, controller.listOfReportsApi)
reportRouters.post('/list-of-report-templates', middleware.listOfReportTemplatesApi, controller.listOfReportTemplatesApi)

//delete routers
reportRouters.post('/delete-report-template', middleware.deleteReportTemplateApi, controller.deleteReportTemplateApi)

export default reportRouters


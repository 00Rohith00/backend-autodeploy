import services from "../../service/reportServices/report.services.js"
 import { okResponse, failResponse } from "../../utils/response.handle.js"


const patientReportApi = async (request, response) => {
    try {
        const result = await services.patientReportApi(request)
        if (result) {
            //write in success-logger database
            okResponse(response, result)
        }
    } catch (error) {
        // write in fail-logger database
        failResponse(response, { status: false, message: error })
    }
}


const listOfReportsApi = async (request, response) => {
    try {
        const result = await services.listOfReportsApi(request)
        if (result) {
            //write in success-logger database
            okResponse(response, result)
        }
    } catch (error) {
        // write in fail-logger database
        failResponse(response, { status: false, message: error })
    }
}

const addReportTemplateApi = async (request, response) => {
    try {
        const result = await services.addReportTemplateApi(request)
        if (result) {
            //write in success-logger database
            okResponse(response, result)
        }
    } catch (error) {
        // write in fail-logger database
        failResponse(response, { status: false, message: error })
    }
}


const listOfReportTemplatesApi = async (request, response) => {
    try {
        const result = await services.listOfReportTemplatesApi(request)
        if (result) {
            //write in success-logger database
            okResponse(response, result)
        }
    } catch (error) {
        // write in fail-logger database
        failResponse(response, { status: false, message: error })
    }
}


const deleteReportTemplateApi = async (request, response) => {
    try {
        const result = await services.deleteReportTemplateApi(request)
        if (result) {
            //write in success-logger database
            okResponse(response, result)
        }
    } catch (error) {
        // write in fail-logger database
        failResponse(response, { status: false, message: error })
    }
}


export default {
     listOfReportsApi, patientReportApi, addReportTemplateApi, listOfReportTemplatesApi, deleteReportTemplateApi
}
import { apiLogger } from "../../middleware/generalMiddleware/api.logger"

//office router imports
const systemAdminRouterCommonMiddlewares = [apiLogger]

const createNewClientApi = [...systemAdminRouterCommonMiddlewares,]


export default {
    createNewClientApi, createNewSuperAdminApi,
    addNewScanApi, deleteScanApi
}
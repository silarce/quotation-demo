import { TsidePathList } from "../type";
import Home from './home'
import Setting from './setting'
import Domestic from './domestic'
import SalesDepartmentForeign from './salesDepartmentForeign'
import WorksDepartment from './worksDepartment'
import Accounting from './accounting'
import FactoryDepartment from './factoryDepartment'
import DocumentManagement from './documentManagement'
import ResearchDepartment from './researchDepartment'

// 首頁　　　　　　　home
// 公司設定　　　　　setting
// 營業部－國內工程　salesDepartmentDomestic => 未改
// 營業部－國外工程　salesDepartmentForeign
// 工務部　　　　　　worksDepartment
// 會計部　　　　　　accountingDepartment => 未改
// 廠務部　　　　　　factoryDepartment
// 審核管理　　　　　documentManagement
// 研發部　　　　　　researchDepartment

/** "allPass" 即使沒有任何權限也pass */
/** allPass 至少有一個權限就pass */
// const allPass = [
//   BasicDataCreation,
//   HRAuthoritySetup,
//   legacyContractIntegration,
//   domestic,
//   statisticsTable,
//   worksDepartment,
//   accountsReceivable,
// ];

/**未決定權限的page會放這個，NEXT_PUBLIC_NAV_DEV_PERMISSIONS基本上會是"allPass"" */
// const devPass: TtopPathListConfig["erpFeature"] = (process.env.NEXT_PUBLIC_NAV_DEV_PERMISSIONS ?? []) as TtopPathListConfig["erpFeature"]
// const devPass: TtopPathListConfig["erpFeature"] = (allPass) as TtopPathListConfig["erpFeature"]

export const sidePathList: TsidePathList = {
    '/home': Home(),
    '/setting': Setting(),
    '/domestic': Domestic(),
    '/salesDepartmentForeign': SalesDepartmentForeign(),
    '/worksDepartment': WorksDepartment(),
    '/accounting': Accounting(),
    '/factoryDepartment': FactoryDepartment(),
    '/documentManagement': DocumentManagement(),
    '/researchDepartment': ResearchDepartment(),
};
import { devPass, erpFeaturesLookup, TsidePathConfig, TsidePathList } from "../type";

export default function SidePathSetting() {

    const {
        BasicDataCreation,
        HRAuthoritySetup,
        legacyContractIntegration,
        domestic,
        statisticsTable,
        worksDepartment,
        accountsReceivable,
        accountingDepartment,
        worksDepartment_worksheet,
        worksDepartment_deliveryList,
        incomeBill,
        fac,
    } = erpFeaturesLookup;

    return (
        (): TsidePathConfig => {
            const path = '/setting';

            return {
                path,
                list: [
                    {
                        label: '基本資料建立',
                        erpFeature: [BasicDataCreation, HRAuthoritySetup],
                        // erpFeature: allPass,
                        list: [
                            {
                                label: '公司資料',
                                path: path + '/company-info',
                                erpFeature: [BasicDataCreation],
                                // erpFeature: allPass,
                            },
                            {
                                label: '公司職等職稱',
                                path: path + '/departments',
                                erpFeature: [BasicDataCreation],
                                // erpFeature: allPass,
                            },
                            {
                                label: '人員資料',
                                path: path + '/employees',
                                erpFeature: [BasicDataCreation],
                                // erpFeature: allPass,
                            },
                            {
                                label: '人事權限管理',
                                path: path + '/hrManage/erpCtrlPermissions',
                                erpFeature: [HRAuthoritySetup],
                                // erpFeature: allPass,
                            },
                        ],
                    },
                    {
                        label: '產品列表',
                        path: path + '/productList',
                        erpFeature: devPass,
                    },
                ],
            };
        }
    )()
}
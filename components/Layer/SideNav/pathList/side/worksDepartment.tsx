import { devPass, erpFeaturesLookup, TsidePathConfig, TsidePathList } from "../type";

export default function SidePathWorksDepartment() {
    return ((): TsidePathConfig => {

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

        const path = '/worksDepartment';

        return {
            path,
            list: [
                {
                    label: '合約',
                    path: path + '/contractList',
                    erpFeature: [
                        //
                        worksDepartment,
                        accountsReceivable,
                        worksDepartment_worksheet,
                        worksDepartment_deliveryList,
                        domestic,
                    ],
                },
                {
                    label: '合約(年度)',
                    path: path + '/yearContractList',
                    erpFeature: [
                        //
                        worksDepartment,
                        accountsReceivable,
                        worksDepartment_worksheet,
                        worksDepartment_deliveryList,
                        domestic,
                    ],
                },
                {
                    label: '外包廠商管理',
                    path: path + '/outsourcingVendorManagement',
                    erpFeature: [worksDepartment, accountsReceivable, worksDepartment_worksheet, worksDepartment_deliveryList],
                },
                {
                    label: '外包計價',
                    path: path + '/outsourcingPricing',
                    erpFeature: [worksDepartment, accountsReceivable, worksDepartment_worksheet, worksDepartment_deliveryList],
                },
                {
                    label: '待辦事項',
                    path: path + '/todoList',
                    erpFeature: [worksDepartment, accountsReceivable, worksDepartment_worksheet, worksDepartment_deliveryList],
                },

                {
                    label: '收入作業',
                    erpFeature: [
                        incomeBill,
                        worksDepartment,
                        accountsReceivable,
                        worksDepartment_worksheet,
                        worksDepartment_deliveryList,
                    ],
                    list: [
                        {
                            label: '會計收款管理',
                            path: path + '/collection',
                            erpFeature: [
                                worksDepartment,
                                accountsReceivable,
                                worksDepartment_worksheet,
                                worksDepartment_deliveryList,
                            ],
                        },
                        {
                            label: '收入傳票管理',
                            path: path + '/incomeSummons',
                            erpFeature: [incomeBill],
                        },
                        {
                            label: '開立發票管理',
                            path: path + '/invoiceManagement',
                            erpFeature: [
                                worksDepartment,
                                accountsReceivable,
                                worksDepartment_worksheet,
                                worksDepartment_deliveryList,
                            ],
                        },
                    ],
                },
                // {
                //   label: '新增派工單',
                //   path: path + '/addDispatch',
                //   erpFeature: devPass,
                // },
                // {
                //   label: '派工進度表',
                //   path: path + '/schedule',
                //   erpFeature: devPass,
                // },
                // {
                //   label: '報表',
                //   erpFeature: devPass,
                //   list: [
                //     {
                //       label: '出貨統計表',
                //       path: path + '/shippingStatistics',
                //       erpFeature: devPass,
                //     },
                //     {
                //       label: '營業狀況表',
                //       path: path + '/StatementOfBusinessConditions',
                //       erpFeature: devPass,
                //     },
                //     {
                //       label: '應收帳款表',
                //       path: path + '/accountsReceivableStatement',
                //       erpFeature: [accountsReceivable],
                //     },
                //     {
                //       label: '代辦事項總覽',
                //       path: path + '/toDoOverview',
                //       erpFeature: devPass,
                //     },
                //   ],
                // },
                // {
                //   label: '外包計價',
                //   path: path + '/outsourcingPricing',
                //   erpFeature: devPass,
                // },
                // {
                //   label: '矯正預防措施處理單',
                //   path: path + '/correctiveAndPreventiveActionSheet',
                //   erpFeature: devPass,
                // },
                // {
                //   label: '機具公物管理',
                //   erpFeature: devPass,
                //   list: [
                //     {
                //       label: '採購維修申請',
                //       path: path + '/purchaseRepairRequest',
                //       erpFeature: devPass,
                //     },
                //     {
                //       label: '公物紀錄表',
                //       path: path + '/publicPropertyRecord',
                //       erpFeature: devPass,
                //     },
                //   ],
                // },
                // {
                //   label: '保養合約',
                //   erpFeature: devPass,
                //   list: [
                //     {
                //       label: '合約',
                //       path: path + '/contract',
                //       erpFeature: devPass,
                //     },
                //     {
                //       label: '派工進度表',
                //       path: path + '/dispatchSchedule',
                //       erpFeature: devPass,
                //     },
                //     {
                //       label: '應收帳款明細',
                //       path: path + '/accountsReceivableDetails',
                //       erpFeature: [accountsReceivable],
                //     },
                //   ],
                // },
            ],
        };
    })()
}
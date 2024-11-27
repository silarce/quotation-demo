import { erpFeaturesLookup, TsidePathConfig } from "../type";

export default function SidePathSalesDepartmentDomestic() {

    const {
        legacyContractIntegration,
        domestic,
        statisticsTable,
        accountsReceivable,
    } = erpFeaturesLookup;

    return ((): TsidePathConfig => {
        const path = '/domestic';

        return {
            path,
            list: [
                {
                    label: '報價',
                    // erpFeature: devPass,
                    erpFeature: [domestic, accountsReceivable],
                    list: [
                        {
                            label: '預算',
                            path: path + '/quotationList',
                            query: {
                                status: 'Budget',
                            },
                            erpFeature: [domestic],
                        },
                        {
                            label: '投標',
                            path: path + '/quotationList',
                            query: {
                                status: 'Bidding',
                            },
                            erpFeature: [domestic],
                        },
                        {
                            label: '發包',
                            path: path + '/quotationList',
                            query: {
                                status: 'Contracting',
                            },
                            erpFeature: [domestic],
                        },
                        {
                            label: '準合約',
                            path: path + '/quotationList',
                            query: {
                                status: 'Pending',
                            },
                            erpFeature: [domestic, accountsReceivable],
                            activeChecker: ({ router }) => {
                                const { status } = router.query;

                                if (status === 'Pending' || status === 'TempPending') {
                                    return true;
                                }

                                return false;
                            },
                        },
                        {
                            label: '合約',
                            path: path + '/contract',
                            erpFeature: [domestic, accountsReceivable],
                        },

                        {
                            label: '查詢報價單',
                            path: path + '/queryQuotation',
                            erpFeature: [domestic],
                        },
                        // {
                        //   label: '歷史紀錄',
                        //   path: path + '/history',
                        //   erpFeature: devPass,
                        // },
                        // {
                        //   label: '報表',
                        //   path: path + '/report',
                        //   erpFeature: devPass,
                        // },
                    ],
                },
                {
                    label: '舊合約整合',
                    path: path + '/legacyContractIntegration',
                    erpFeature: [legacyContractIntegration],
                    // erpFeature: allPass,
                },
                // {
                //   label: '查詢工作表',
                //   path: path + '/unSet',
                //   erpFeature: devPass,
                // },
                // {
                //   label: '查詢應收帳款明細',
                //   path: path + '/unSet',
                //   erpFeature: [accountsReceivable],
                // },
                // {
                //   label: '查詢派工單明細',
                //   path: path + '/unSet',
                //   erpFeature: devPass,
                // },
                {
                    label: '統計表',
                    erpFeature: [statisticsTable],
                    list: [
                        {
                            label: '報價統計表',
                            path: path + '/quoteStatistics',
                            erpFeature: [statisticsTable],
                        },
                        {
                            label: '個人業績統計表',
                            path: path + '/personalPerformanceStatistics',
                            erpFeature: [statisticsTable],
                        },
                        {
                            label: '全區業績統計表',
                            path: path + '/regionalPerformanceStatistics',
                            erpFeature: [statisticsTable],
                        },
                        {
                            label: '追加工程統計表',
                            path: path + '/additionalEngineeringStatistics',
                            erpFeature: [statisticsTable],
                        },
                        {
                            label: '年度業績統計表',
                            path: path + '/annualPerformanceStatistics',
                            erpFeature: [statisticsTable],
                        },
                    ],
                },
                {
                    label: '客戶列表',
                    path: path + '/customer',
                    // erpFeature: allPass,
                    erpFeature: [domestic],
                },
                {
                    label: '備註列表',
                    path: path + '/annotationList',
                    // erpFeature: [BasicDataCreation],
                    erpFeature: [domestic],
                },
                {
                    label: '報價範圍列表',
                    path: path + '/quotationRanges',
                    // erpFeature: [BasicDataCreation],
                    erpFeature: [domestic],
                },
            ],
        };
    })()
}
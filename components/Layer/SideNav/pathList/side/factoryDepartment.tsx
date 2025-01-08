import { devPass, erpFeaturesLookup, TsidePathConfig } from "../type";

export default function SidePatFactoryDepartment() {
    return ((): TsidePathConfig => {
        const path = '/factoryDepartment';

        const {
            fac,
        } = erpFeaturesLookup;

        return {
            path,
            list: [
                {
                    label: '單據管理',
                    erpFeature: devPass,
                    list: [
                       
                        {
                            label: '新增請購',
                            path: path + '/addPurchaseRequisitionList',
                            erpFeature: [fac],
                        },
                        {
                            label: '價格查詢',
                            // path: path + '/quotereqList',
                            path: path + '/PriQueryList',
                            activeChecker: ({ router }) => {
                                const { pathname, query } = router;

                                if (pathname === '/factoryDepartment/PriQueryList') {
                                    return true;
                                }

                                return false;
                            },
                            erpFeature: [fac],
                        },
                        {
                            label: '詢價列表',
                            // path: path + '/quotereqList',
                            path: path + '/QReqList',
                            activeChecker: ({ router }) => {
                                const { pathname, query } = router;

                                if (pathname === '/factoryDepartment/QReqList') {
                                    return true;
                                } else if (pathname === '/factoryDepartment/addQReqList') {
                                    return true;
                                } else if (pathname === '/factoryDepartment/QReqDetail') {
                                    return true;
                                }

                                return false;
                            },
                            erpFeature: [fac],
                        },
                        {
                            label: '請購列表',
                            path: path + '/PRequisitionList',
                            activeChecker: ({ router }) => {
                                const { pathname, query } = router;

                                if (pathname === '/factoryDepartment/PRequisitionList') {
                                    return true;
                                } else if (pathname === '/factoryDepartment/PRequisitionDetail') {
                                    return true;
                                }

                                return false;
                            },
                            query: {
                                type: 'PRequisitionList',
                            },
                            erpFeature: [fac],
                        },
                        {
                            label: '採購列表',
                            path: path + '/POrderList',
                            activeChecker: ({ router }) => {
                                const { pathname, query } = router;

                                if (pathname === '/factoryDepartment/POrderList') {
                                    return true;
                                } else if (pathname === '/factoryDepartment/addPurchaseOrderList') {
                                    return true;
                                } else if (pathname === '/factoryDepartment/POrderDetail') {
                                    return true;
                                }

                                return false;
                            },
                            query: {
                                type: 'POrderList',
                            },
                            erpFeature: [fac],
                        },
                        {
                            label: '進貨列表',
                            path: path + '/PReceiptList',
                            activeChecker: ({ router }) => {
                                const { pathname, query } = router;

                                if (pathname === '/factoryDepartment/PReceiptList') {
                                    return true;
                                } else if (pathname === '/factoryDepartment/addProdReceiptList') {
                                    return true;
                                } else if (pathname === '/factoryDepartment/PReceiptDetail') {
                                    return true;
                                }

                                return false;
                            },
                            query: {
                                type: 'prodReceiptList',
                            },
                            erpFeature: [fac],
                        },
                    ],
                },
                {
                    label: '倉儲管理',
                    erpFeature: devPass,
                    list: [
                        {
                            label: '入庫列表',
                            path: path + '/PEntryList',
                            activeChecker: ({ router }) => {
                                const { pathname, query } = router;

                                if (pathname === '/factoryDepartment/PEntryList') {
                                    return true;
                                } else if (pathname === '/factoryDepartment/PEntryDetail') {
                                    return true;
                                } else if (pathname === '/factoryDepartment/PEntryIn') {
                                    return true;
                                }

                                return false;
                            },
                            query: {
                                type: 'PEntryList',
                            },
                            erpFeature: [fac],
                        },
                        {
                            label: '領料列表',
                            path: path + '/PKingList',
                            activeChecker: ({ router }) => {
                                const { pathname, query } = router;

                                if (pathname === '/factoryDepartment/PKingList') {
                                    return true;
                                } else if (pathname === '/factoryDepartment/PKingDetail') {
                                    return true;
                                }

                                return false;
                            },
                            query: {
                                type: 'PKingList',
                            },
                            erpFeature: [fac],
                        },
                        {
                            label: '物料維護',
                            path: path + '/productList',
                            query: {
                                type: 'productList',
                            },
                            erpFeature: [fac],
                        },
                        {
                            label: 'BOM維護',
                            path: path + '/bomList',
                            query: {
                                type: 'bomList',
                            },
                            erpFeature: [fac],
                        },
                        {
                            label: '儲位管理',
                            path: path + '/wareHouseList',
                            activeChecker: ({ router }) => {
                                const { pathname, query } = router;

                                if (pathname === '/factoryDepartment/trayList') {
                                    return true;
                                } else if (pathname === '/factoryDepartment/addTray') {
                                    return true;
                                } else if (pathname === '/factoryDepartment/wareHouseList') {
                                    return true;
                                } else if (pathname === '/factoryDepartment/editWHPosition') {
                                    return true;
                                }

                                return false;
                            },
                            query: {
                                type: 'WareHouse',
                            },
                            erpFeature: [fac],
                        },
                    ],
                },
            ],
        };
    })()
}
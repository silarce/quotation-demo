import { devPass, erpFeaturesLookup, TsidePathConfig } from "../type";

export default function SidePathAccountingDepartment() {
    return ((): TsidePathConfig => {
        const path = '/accounting';

        const {
            accountsReceivable,
            accountingDepartment,
        } = erpFeaturesLookup;

        return {
            path,
            list: [
                {
                    label: '收款作業',
                    erpFeature: [accountingDepartment],
                    list: [
                        {
                            label: '收款管理',
                            path: path + '/collection',
                            erpFeature: [accountingDepartment],
                            activeChecker: ({ router }) => {
                                if (router.route === '/accounting/collection') {
                                    return true;
                                }

                                return false;
                            },
                        },
                        {
                            label: '收款明細表',
                            path: path + '/collectionDetailList',
                            erpFeature: [accountingDepartment],
                            activeChecker: ({ router }) => {
                                if (router.route === '/accounting/collectionDetailList') {
                                    return true;
                                }

                                return false;
                            },
                        },
                        {
                            label: '票據兌現明細表',
                            path: path + '/billCashingDetailList',
                            erpFeature: [accountingDepartment],
                        },
                    ],
                },
                {
                    label: '發票作業',
                    erpFeature: [accountingDepartment],
                    list: [
                        {
                            label: '購買發票',
                            path: path + '/invoiceBook',
                            erpFeature: [accountingDepartment],
                        },
                        {
                            label: '開立發票管理',
                            path: path + '/invoiceManagement',
                            erpFeature: [accountingDepartment],
                        },
                    ],
                },
                {
                    label: '銀行管理',
                    path: path + '/bankManagement',
                    erpFeature: [accountingDepartment],
                },
                {
                    label: '應付帳款',
                    erpFeature: [accountsReceivable],
                    list: [
                        {
                            label: '支出單',
                            path: path + '/applyPayment',
                            erpFeature: [accountsReceivable],
                        },
                        {
                            label: '進貨收票單',
                            path: path + '/purchaseCollectTicket',
                            erpFeature: [accountsReceivable],
                        },
                        {
                            label: '付款申請',
                            path: path + '/paymentApplication',
                            erpFeature: [accountsReceivable],
                        },
                        {
                            label: '應付帳款明細表',
                            path: path + '/accountsPayableDetailList',
                            erpFeature: [accountsReceivable],
                        },
                    ],
                },
                {
                    label: '薪資管理',
                    erpFeature: [accountingDepartment],
                    list: [
                        {
                            label: '結算薪資作業',
                            path: path + '/salarySettlement',
                            erpFeature: [accountingDepartment],
                        },
                        {
                            label: '薪資帳簿',
                            path: path + '/payrollLedger',
                            erpFeature: [accountingDepartment],
                        },
                        {
                            label: '薪資維護',
                            path: path + '/salaryMaintenance',
                            erpFeature: [accountingDepartment],
                        },
                        {
                            label: '獎金/津貼維護',
                            path: path + '/bonusMaintenance',
                            erpFeature: [accountingDepartment],
                        },
                        {
                            label: '獎金發放作業',
                            path: path + '/bonusPayout',
                            erpFeature: [accountingDepartment],
                        },
                    ],
                },
                {
                    label: 'foo',
                    erpFeature: devPass,
                    list: [
                        {
                            label: 'foo',
                            path: path + '/undefined',
                            erpFeature: devPass,
                        },
                        {
                            label: 'foo',
                            path: path + '/undefined',
                            erpFeature: devPass,
                        },
                    ],
                },
            ],
        };
    })()
}
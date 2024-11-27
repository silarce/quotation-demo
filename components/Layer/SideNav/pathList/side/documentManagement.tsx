import {  erpFeaturesLookup, TsidePathConfig } from "../type";

export default function SidePathDocumentManagement() {
    return ((): TsidePathConfig => {
        const path = '/documentManagement';

        const {
            fac,
        } = erpFeaturesLookup;

        return {
            path,
            list: [
                {
                    label: '審核管理',
                    erpFeature: [fac],
                    list: [
                        {
                            label: '審核清單',
                            path: path + '/reviewList',
                            erpFeature: [fac],
                        },
                        {
                            label: '自訂審核',
                            path: path + '/flowList',
                            erpFeature: [fac],
                        },
                    ],
                },
                // {
                //   label: '單據審核',
                //   erpFeature: devPass,
                //   list: [
                //     {
                //       label: '簽核清單',
                //       path: path + '/reviewList',
                //       activeChecker: ({ router }) => {
                //         const { pathname, query } = router;

                //         if (pathname === '/factoryDepartment/reviewList') {
                //           return true;
                //         }

                //         return false;
                //       },
                //       query: {
                //         type: 'WareHouse',
                //       },
                //       erpFeature: devPass,
                //     },
                //   ],
                // },
            ],
        };
    })()
}
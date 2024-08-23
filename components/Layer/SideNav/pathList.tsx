// import { ParsedUrlQuery } from 'querystring';
import { NextRouter } from 'next/router';

// icon
import icon_home from 'public/image/icon/home.svg';
import icon_setting from 'public/image/icon/setting.svg';
import icon_domestic from 'public/image/icon/domestic.svg';
import icon_foreign from 'public/image/icon/foreign.svg';
import icon_project from 'public/image/icon/project.svg';
import icon_warehouse from 'public/image/icon/warehouse.svg';
import icon_shareform from 'public/image/icon/sharedform.svg';

type ErpFeaturesValues = (typeof erpFeaturesLookup)[keyof typeof erpFeaturesLookup];

type TsidePathConfig = {
  //antd Collapse用的，設定預設被選中的面板，大部分時候用不到
  defaultCollapse?: string;
  path01: string;
  list: {
    label: string;
    path?: string;
    query?: {
      [key: string]: string;
    };
    erpFeature: ErpFeaturesValues[] | 'allPass';
    otherPermissions?: {
      grade?: number;
    };
    activeChecker?: (props: { router: NextRouter }) => boolean;
    list?: {
      label: string;
      path: string;
      query?: {
        [key: string]: string;
      };
      /**空陣列會全部禁止 */
      erpFeature: ErpFeaturesValues[] | 'allPass';
      otherPermissions?: {
        grade?: number;
      };
      // 例外，只要符合其中一個就通過
      exception?: {
        idNumber?: string[];
      };
      activeChecker?: (props: { router: NextRouter }) => boolean;
    }[];
  }[];
};

type Thref = {
  pathname: string;
  query?: {
    [key: string]: string;
  };
};

type TtopPathListConfig = {
  icon: string;
  label: string;
  subLabel?: string;
  path01: string;

  // href: {
  //   pathname: string;
  //   query?: {
  //     [key: string]: string;
  //   };
  // };
  href: Thref;
  // 在Nav.tsx會依序檢查hrefList的key與erpFeature，決定點進去的連結
  hrefList?: {
    [key: string]: Thref;
  };
  //
  erpFeature: ErpFeaturesValues[] | 'allPass';
};

interface TsidePathList {
  [key: string]: TsidePathConfig;
}

// =========================================================================

const erpFeaturesLookup = {
  BasicDataCreation: '基本資料建立',
  HRAuthoritySetup: '人事權限建立',
  legacyContractIntegration: '舊合約',
  domestic: '營業部國內工程',
  statisticsTable: '統計表',
  worksDepartment: '工務部',
  accountsReceivable: '應收帳款',
  accountingDepartment: '會計部',
  worksDepartment_worksheet: '工務部-工作表編輯',
  worksDepartment_deliveryList: '工務部-出庫單編輯',
  incomeBill: '收入傳票',
  fac:'廠務部'
} as const;

// key:value逆轉版本的erpFeaturesLookup
const swappedErpFeaturesLookup: { [key: string]: string } = {};

for (const key in erpFeaturesLookup) {
  const theKey = key as keyof typeof erpFeaturesLookup;
  const value = erpFeaturesLookup[theKey];
  swappedErpFeaturesLookup[value] = key;
}

const {
  //
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
  fac
} = erpFeaturesLookup;

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
const devPass: TtopPathListConfig['erpFeature'] = 'allPass';
// =========================================================================

const sidePathList: TsidePathList = {
  '/home': ((): TsidePathConfig => {
    const path01 = '/home';

    return {
      path01,
      list: [
        {
          label: '日報表',
          erpFeature: 'allPass',
          list: [
            {
              label: '我的日報表',
              path: path01 + '/dailyReport',
              query: { isMine: 'true' },
              erpFeature: 'allPass',
            },
            {
              label: '審核日報表',
              path: path01 + '/dailyReport',
              query: { isMine: 'false' },
              erpFeature: 'allPass',
            },
            {
              label: '報表',
              path: path01 + '/monthReport',
              erpFeature: 'allPass',
              otherPermissions: {
                grade: 14,
              },
              exception: {
                idNumber: ['EM-10902-01'], // 會計的帳號(只在正式環境中)
              },
            },
          ],
        },
      ],
    };
  })(),
  // ------------------------------------
  '/setting': ((): TsidePathConfig => {
    const path01 = '/setting';

    return {
      path01,
      list: [
        {
          label: '基本資料建立',
          erpFeature: [BasicDataCreation, HRAuthoritySetup],
          // erpFeature: allPass,
          list: [
            {
              label: '公司資料',
              path: path01 + '/company-info',
              erpFeature: [BasicDataCreation],
              // erpFeature: allPass,
            },
            {
              label: '公司職等職稱',
              path: path01 + '/departments',
              erpFeature: [BasicDataCreation],
              // erpFeature: allPass,
            },
            {
              label: '人員資料',
              path: path01 + '/employees',
              erpFeature: [BasicDataCreation],
              // erpFeature: allPass,
            },
            {
              label: '人事權限管理',
              path: path01 + '/hrManage/erpCtrlPermissions',
              erpFeature: [HRAuthoritySetup],
              // erpFeature: allPass,
            },
          ],
        },
        {
          label: '產品列表',
          path: path01 + '/productList',
          erpFeature: devPass,
        },
      ],
    };
  })(),
  // --------------------------------------
  '/domestic': ((): TsidePathConfig => {
    const path01 = '/domestic';

    return {
      path01,
      list: [
        {
          label: '報價',
          // erpFeature: devPass,
          erpFeature: [domestic, accountsReceivable],
          list: [
            {
              label: '預算',
              path: path01 + '/quotationList',
              query: {
                status: 'Budget',
              },
              erpFeature: [domestic],
            },
            {
              label: '投標',
              path: path01 + '/quotationList',
              query: {
                status: 'Bidding',
              },
              erpFeature: [domestic],
            },
            {
              label: '發包',
              path: path01 + '/quotationList',
              query: {
                status: 'Contracting',
              },
              erpFeature: [domestic],
            },
            {
              label: '準合約',
              path: path01 + '/quotationList',
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
              path: path01 + '/contract',
              erpFeature: [domestic, accountsReceivable],
            },

            {
              label: '查詢報價單',
              path: path01 + '/queryQuotation',
              erpFeature: [domestic],
            },
            // {
            //   label: '歷史紀錄',
            //   path: path01 + '/history',
            //   erpFeature: devPass,
            // },
            // {
            //   label: '報表',
            //   path: path01 + '/report',
            //   erpFeature: devPass,
            // },
          ],
        },
        {
          label: '舊合約整合',
          path: path01 + '/legacyContractIntegration',
          erpFeature: [legacyContractIntegration],
          // erpFeature: allPass,
        },
        // {
        //   label: '查詢工作表',
        //   path: path01 + '/unSet',
        //   erpFeature: devPass,
        // },
        // {
        //   label: '查詢應收帳款明細',
        //   path: path01 + '/unSet',
        //   erpFeature: [accountsReceivable],
        // },
        // {
        //   label: '查詢派工單明細',
        //   path: path01 + '/unSet',
        //   erpFeature: devPass,
        // },
        {
          label: '統計表',
          erpFeature: [statisticsTable],
          list: [
            {
              label: '報價統計表',
              path: path01 + '/quoteStatistics',
              erpFeature: [statisticsTable],
            },
            {
              label: '個人業績統計表',
              path: path01 + '/personalPerformanceStatistics',
              erpFeature: [statisticsTable],
            },
            {
              label: '全區業績統計表',
              path: path01 + '/regionalPerformanceStatistics',
              erpFeature: [statisticsTable],
            },
            {
              label: '追加工程統計表',
              path: path01 + '/additionalEngineeringStatistics',
              erpFeature: [statisticsTable],
            },
            {
              label: '年度業績統計表',
              path: path01 + '/annualPerformanceStatistics',
              erpFeature: [statisticsTable],
            },
          ],
        },
        {
          label: '客戶列表',
          path: path01 + '/customer',
          // erpFeature: allPass,
          erpFeature: [domestic],
        },
        {
          label: '備註列表',
          path: path01 + '/annotationList',
          // erpFeature: [BasicDataCreation],
          erpFeature: [domestic],
        },
        {
          label: '報價範圍列表',
          path: path01 + '/quotationRanges',
          // erpFeature: [BasicDataCreation],
          erpFeature: [domestic],
        },
      ],
    };
  })(),
  // -----------------------------
  '/foreign': ((): TsidePathConfig => {
    const path01 = '/foreign';

    return {
      path01,
      list: [
        {
          label: '國外工程',
          erpFeature: devPass,
          list: [
            {
              label: '施工中',
              path: path01 + '/unset',
              erpFeature: devPass,
            },
            {
              label: '施工中',
              path: path01 + '/unset',
              erpFeature: devPass,
            },
            {
              label: '施工中',
              path: path01 + '/unset',
              erpFeature: devPass,
            },
            {
              label: '施工中',
              path: path01 + '/unset',
              erpFeature: devPass,
            },
          ],
        },
        {
          label: '施工中',
          path: path01 + '/unset',
          erpFeature: devPass,
        },
      ],
    };
  })(),
  // -----------------------------
  '/worksDepartment': ((): TsidePathConfig => {
    const path01 = '/worksDepartment';

    return {
      path01,
      list: [
        {
          label: '合約',
          path: path01 + '/contractList',
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
          path: path01 + '/yearContractList',
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
          path: path01 + '/outsourcingVendorManagement',
          erpFeature: [worksDepartment, accountsReceivable, worksDepartment_worksheet, worksDepartment_deliveryList],
        },
        {
          label: '外包計價',
          path: path01 + '/outsourcingPricing',
          erpFeature: [worksDepartment, accountsReceivable, worksDepartment_worksheet, worksDepartment_deliveryList],
        },
        {
          label: '待辦事項',
          path: path01 + '/todoList',
          erpFeature: [worksDepartment, accountsReceivable, worksDepartment_worksheet, worksDepartment_deliveryList],
        },

        {
          label: '收入作業',
          erpFeature: [incomeBill],
          list: [
            {
              label: '會計收款管理',
              path: path01 + '/collection',
              erpFeature: [
                worksDepartment,
                accountsReceivable,
                worksDepartment_worksheet,
                worksDepartment_deliveryList,
              ],
            },
            {
              label: '收入傳票管理',
              path: path01 + '/incomeSummons',
              erpFeature: [incomeBill],
            },
            {
              label: '開立發票管理',
              path: path01 + '/invoiceManagement',
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
        //   path: path01 + '/addDispatch',
        //   erpFeature: devPass,
        // },
        // {
        //   label: '派工進度表',
        //   path: path01 + '/schedule',
        //   erpFeature: devPass,
        // },
        // {
        //   label: '報表',
        //   erpFeature: devPass,
        //   list: [
        //     {
        //       label: '出貨統計表',
        //       path: path01 + '/shippingStatistics',
        //       erpFeature: devPass,
        //     },
        //     {
        //       label: '營業狀況表',
        //       path: path01 + '/StatementOfBusinessConditions',
        //       erpFeature: devPass,
        //     },
        //     {
        //       label: '應收帳款表',
        //       path: path01 + '/accountsReceivableStatement',
        //       erpFeature: [accountsReceivable],
        //     },
        //     {
        //       label: '代辦事項總覽',
        //       path: path01 + '/toDoOverview',
        //       erpFeature: devPass,
        //     },
        //   ],
        // },
        // {
        //   label: '外包計價',
        //   path: path01 + '/outsourcingPricing',
        //   erpFeature: devPass,
        // },
        // {
        //   label: '矯正預防措施處理單',
        //   path: path01 + '/correctiveAndPreventiveActionSheet',
        //   erpFeature: devPass,
        // },
        // {
        //   label: '機具公物管理',
        //   erpFeature: devPass,
        //   list: [
        //     {
        //       label: '採購維修申請',
        //       path: path01 + '/purchaseRepairRequest',
        //       erpFeature: devPass,
        //     },
        //     {
        //       label: '公物紀錄表',
        //       path: path01 + '/publicPropertyRecord',
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
        //       path: path01 + '/contract',
        //       erpFeature: devPass,
        //     },
        //     {
        //       label: '派工進度表',
        //       path: path01 + '/dispatchSchedule',
        //       erpFeature: devPass,
        //     },
        //     {
        //       label: '應收帳款明細',
        //       path: path01 + '/accountsReceivableDetails',
        //       erpFeature: [accountsReceivable],
        //     },
        //   ],
        // },
      ],
    };
  })(),

  '/accounting': ((): TsidePathConfig => {
    const path01 = '/accounting';

    return {
      path01,
      list: [
        {
          label: '收款作業',
          erpFeature: [accountingDepartment],
          list: [
            {
              label: '收款管理',
              path: path01 + '/collection',
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
              path: path01 + '/collectionDetailList',
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
              path: path01 + '/billCashingDetailList',
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
              path: path01 + '/invoiceBook',
              erpFeature: [accountingDepartment],
            },
            {
              label: '開立發票管理',
              path: path01 + '/invoiceManagement',
              erpFeature: [accountingDepartment],
            },
          ],
        },
        // {
        //   label: 'foo',
        //   erpFeature: devPass,
        //   list: [
        //     {
        //       label: 'foo',
        //       path: path01 + '/undefined',
        //       erpFeature: devPass,
        //     },
        //     {
        //       label: 'foo',
        //       path: path01 + '/undefined',
        //       erpFeature: devPass,
        //     },
        //   ],
        // },
      ],
    };
  })(),
  '/factoryDepartment': ((): TsidePathConfig => {
    const path01 = '/factoryDepartment';

    return {
      path01,
      list: [
        {
          label: '單據管理',
          erpFeature: devPass,
          list: [
            // {
            //   label: '單據審核',
            //   path: path01 + '/reviewList',
            //   erpFeature: devPass,
            // },
            {
              label: '請購申請',
              path: path01 + '/addPurchaseRequisition',
              erpFeature: [fac],
            },
            {
              label: '請購管理',
              path: path01 + '/purchaseRequisitionList',
              activeChecker: ({ router }) => {
                const { pathname, query } = router;
                console.log(router);

                if (pathname === '/factoryDepartment/purchaseRequisitionList') {
                  return true;
                } else if (pathname === '/factoryDepartment/quotereqDetailList') {
                  return true;
                }

                return false;
              },
              query: {
                type: 'purchaseRequisitionList',
              },
              erpFeature: [fac],
            },
            {
              label: '採購管理',
              path: path01 + '/purchaseOrderList',
              activeChecker: ({ router }) => {
                const { pathname, query } = router;
                console.log(router);

                if (pathname === '/factoryDepartment/purchaseOrderList') {
                  return true;
                } else if (pathname === '/factoryDepartment/addPurchaseOrder') {
                  return true;
                }

                return false;
              },
              query: {
                type: 'purchaseOrderList',
              },
              erpFeature: [fac],
            },
            {
              label: '進貨管理',
              path: path01 + '/prodReceiptList',
              activeChecker: ({ router }) => {
                const { pathname, query } = router;
                console.log(router);

                if (pathname === '/factoryDepartment/prodReceiptList') {
                  return true;
                }

                return false;
              },
              query: {
                type: 'prodReceiptList',
              },
              erpFeature: [fac],
            },
            {
              label: '領料管理',
              path: path01 + '/pickingList',
              activeChecker: ({ router }) => {
                const { pathname, query } = router;
                console.log(router);

                if (pathname === '/factoryDepartment/pickingList') {
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
              label: '儲位管理',
              path: path01 + '/wareHouseList',
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

            {
              label: '入庫管理',
              path: path01 + '/prodEntryList',
              activeChecker: ({ router }) => {
                const { pathname, query } = router;
                console.log(router);

                if (pathname === '/factoryDepartment/prodEntryList') {
                  return true;
                }

                return false;
              },
              query: {
                type: 'prodEntryList',
              },
              erpFeature: [fac],
            },
            {
              label: '物料維護',
              path: path01 + '/productList',
              query: {
                type: 'productList',
              },
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
        //       path: path01 + '/reviewList',
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
  })(),
'/documentManagement': ((): TsidePathConfig => {
    const path01 = '/documentManagement';

    return {
      path01,
      list: [
        {
          label: '單據管理',
          erpFeature: devPass,
          list: [
            {
              label: '簽核清單',
              path: path01 + '/reviewList',
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
        //       path: path01 + '/reviewList',
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
  })(),
  // =======================================
};

// 上方nav用的路由表
// components\Layer\Header\Nav\Nav.tsx
const topPathList: TtopPathListConfig[] = [
  {
    icon: icon_home,
    label: '首頁',
    path01: sidePathList['/home'].path01,
    href: {
      pathname: '/home/dailyReport',
      query: { isMine: 'true' },
    },
    erpFeature: 'allPass',
  },
  {
    icon: icon_setting,
    label: '公司設定',
    path01: sidePathList['/setting'].path01,
    href: {
      pathname: sidePathList['/setting'].path01 + '/company-info',
    },
    erpFeature: [BasicDataCreation, HRAuthoritySetup],
    // erpFeature: allPass,
  },
  {
    icon: icon_domestic,
    label: '營業部',
    subLabel: '-國內工程',
    path01: sidePathList['/domestic'].path01,
    href: {
      pathname: sidePathList['/domestic'].path01 + '/quotationList',
      query: {
        status: 'Budget',
      },
    },
    hrefList: {
      domestic: {
        pathname: sidePathList['/domestic'].path01 + '/quotationList',
        query: {
          status: 'Budget',
        },
      },
      legacyContractIntegration: {
        pathname: sidePathList['/domestic'].path01 + '/legacyContractIntegration',
      },
      statisticsTable: {
        pathname: sidePathList['/domestic'].path01 + '/legacyContractIntegration',
      },
      accountsReceivable: {
        pathname: sidePathList['/domestic'].path01 + '/quotationList',
        query: {
          status: 'Pending',
        },
      },
    },

    erpFeature: [domestic, legacyContractIntegration, statisticsTable, accountsReceivable],
  },
  // {
  //   icon: icon_foreign,
  //   label: '營業部',
  //   subLabel: '-國外工程',
  //   path01: sidePathList['/foreign'].path01,
  //   href: {
  //     pathname: sidePathList['/foreign'].path01 + '',
  //   },
  //   erpFeature: devPass,
  // },
  {
    icon: icon_project,
    label: '工務部',
    path01: sidePathList['/worksDepartment'].path01,
    href: {
      pathname: sidePathList['/worksDepartment'].path01 + '/contractList',
    },
    erpFeature: [
      worksDepartment,
      accountsReceivable,
      worksDepartment_worksheet,
      worksDepartment_deliveryList,
      domestic,
      incomeBill,
    ],
  },
  {
    icon: icon_project,
    label: '會計部',
    path01: sidePathList['/accounting'].path01,
    href: {
      pathname: sidePathList['/accounting'].path01 + '/collection',
    },
    erpFeature: [accountsReceivable, accountingDepartment],
  },
  {
    icon: icon_warehouse,
    label: '廠務部',
    path01: sidePathList['/factoryDepartment'].path01,
    href: {
      pathname: sidePathList['/factoryDepartment'].path01 + '/wareHouseList',
      query: {
        type: 'WareHouse',
      },
    },
    erpFeature: [fac],
  },
  {
    icon: icon_shareform,
    label: '單據管理',
    path01: sidePathList['/documentManagement'].path01,
    href: {
      pathname: sidePathList['/documentManagement'].path01 + '/reviewList',
      query: {
        type: 'Review',
      },
    },
    erpFeature: devPass,
  },
];

export default sidePathList;
export { topPathList, erpFeaturesLookup, swappedErpFeaturesLookup };

export type { TtopPathListConfig };

// =========================================================
// TsidePathConfig範例
// {
//   path01,
//   list: [
//     {
//       label: "首頁",
//       list: [
//         {
//           label: "施工中",
//           path: path01 + "/",
//         },
//         {
//           label: "施工中",
//           path: path01 + "/",
//         },
//         {
//           label: "施工中",
//           path: path01 + "/",
//         },
//         {
//           label: "施工中",
//           path: path01 + "/",
//         },
//       ]
//     },
//     {
//       label: "施工中",
//       path: path01 + "/",
//     },
//     {
//       label: "施工中",
//       path: path01 + "/",
//     },
//   ]
// }

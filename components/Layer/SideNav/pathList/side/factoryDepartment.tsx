import { devPass, erpFeaturesLookup, TsidePathConfig } from '../type';

export default function SidePatFactoryDepartment() {
  return ((): TsidePathConfig => {
    const path = '/factoryDepartment';

    const { fac } = erpFeaturesLookup;

    return {
      path,
      list: [
        {
          label: '單據管理',
          erpFeature: devPass,
          list: [
            {
              label: '詢價管理',
              path: path + '/quotereqList',
              erpFeature: [fac],
            },
            {
              label: '請購申請',
              path: path + '/addPurchaseRequisition',
              erpFeature: [fac],
            },
            {
              label: '請購管理',
              path: path + '/purchaseRequisitionList',
              activeChecker: ({ router }) => {
                const { pathname, query } = router;

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
              path: path + '/purchaseOrderList',
              activeChecker: ({ router }) => {
                const { pathname, query } = router;

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
              path: path + '/prodReceiptList',
              activeChecker: ({ router }) => {
                const { pathname, query } = router;

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
          ],
        },
        {
          label: '倉儲管理',
          erpFeature: devPass,
          list: [
            {
              label: '領料管理',
              path: path + '/pickingList',
              activeChecker: ({ router }) => {
                const { pathname, query } = router;

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
            {
              label: '入庫管理',
              path: path + '/prodEntryList',
              activeChecker: ({ router }) => {
                const { pathname, query } = router;

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
        {
          label: '送電備品',
          path: path + '/electronicSupplies',
          erpFeature: [fac],
        },
      ],
      //
    };
  })();
}

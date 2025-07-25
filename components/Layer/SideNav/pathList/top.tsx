import icon_home from 'public/image/icon/home.svg?url';
import icon_setting from 'public/image/icon/setting.svg?url';
import icon_domestic from 'public/image/icon/domestic.svg?url';
import icon_foreign from 'public/image/icon/foreign.svg?url';
import icon_project from 'public/image/icon/project.svg?url';
import icon_warehouse from 'public/image/icon/warehouse.svg?url';
import icon_shareform from 'public/image/icon/sharedform.svg?url';

import { erpFeaturesLookup, TtopPathListConfig, devPass } from './type';

import { sidePathList } from './side';

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
  worksDepartment_readonly,
} = erpFeaturesLookup;

const homePath = sidePathList['/home'].path;
const settingPath = sidePathList['/setting'].path;
const domesticPath = sidePathList['/domestic'].path;
const worksDepartmentPath = sidePathList['/worksDepartment'].path;
const accounting = sidePathList['/accounting'].path;
const factoryDepartment = sidePathList['/factoryDepartment'].path;
const documentManagementPath = sidePathList['/documentManagement'].path;
const researchDepartmentPath = sidePathList['/researchDepartment'].path;
const personnelPath = sidePathList['/personnel'].path;
const organizationPath = sidePathList['/organization'].path;

const topPathList: TtopPathListConfig[] = [
  {
    icon: icon_home,
    label: '首頁',
    path: homePath,
    href: {
      pathname: '/home/dailyReport',
      query: { isMine: 'true' },
    },
    erpFeature: 'allPass',
  },
  {
    icon: icon_setting,
    label: '公司設定',
    path: settingPath,
    href: {
      pathname: settingPath + '/company-info',
    },
    erpFeature: [BasicDataCreation, HRAuthoritySetup],
  },
  {
    icon: icon_domestic,
    label: '營業部',
    subLabel: '-國內工程',
    path: domesticPath,
    href: {
      pathname: domesticPath + '/quotationList',
      query: {
        status: 'Budget',
      },
    },
    hrefList: {
      domestic: {
        pathname: domesticPath + '/quotationList',
        query: {
          status: 'Budget',
        },
      },
      legacyContractIntegration: {
        pathname: domesticPath + '/legacyContractIntegration',
      },
      statisticsTable: {
        pathname: domesticPath + '/legacyContractIntegration',
      },
      accountsReceivable: {
        pathname: domesticPath + '/quotationList',
        query: {
          status: 'Pending',
        },
      },
    },
    erpFeature: [domestic, legacyContractIntegration, statisticsTable, accountsReceivable],
  },
  {
    icon: icon_project,
    label: '工務部',
    path: worksDepartmentPath,
    href: {
      pathname: worksDepartmentPath + '/contractList',
    },
    erpFeature: [
      worksDepartment,
      accountsReceivable,
      worksDepartment_worksheet,
      worksDepartment_deliveryList,
      domestic,
      incomeBill,
      worksDepartment_readonly,
    ],
  },
  {
    icon: icon_project,
    label: '會計部',
    path: accounting,
    href: {
      pathname: accounting + '/collection',
    },
    erpFeature: [accountsReceivable, accountingDepartment],
  },
  {
    icon: icon_warehouse,
    label: '廠務部',
    path: factoryDepartment,
    href: {
      pathname: factoryDepartment + '/wareHouseList',
      query: {
        type: 'WareHouse',
      },
    },
    erpFeature: [fac],
  },
  {
    icon: icon_shareform,
    label: '審核管理',
    path: documentManagementPath,
    href: {
      pathname: documentManagementPath + '/reviewList',
      query: {
        type: 'Review',
      },
    },
    erpFeature: 'allPass',
  },
  {
    icon: icon_project,
    label: '研發部',
    path: researchDepartmentPath,
    href: {
      pathname: researchDepartmentPath + '/workSheet',
    },
    erpFeature: devPass,
  },
  {
    icon: icon_home,
    label: '人事管理',
    path: personnelPath,
    href: {
      pathname: '/personnel/shift',
      query: { isMine: 'true' },
    },
    erpFeature: 'allPass',
  },
  {
    icon: icon_home,
    label: '組織管理',
    path: organizationPath,
    href: {
      pathname: '/organization/company',
      query: { isMine: 'true' },
    },
    erpFeature: 'allPass',
  },
];

export { topPathList };

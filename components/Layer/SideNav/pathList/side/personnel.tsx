import { devPass, TsidePathConfig } from '../type';

const isInProd = process.env.NEXT_PUBLIC_NODE_ENV === 'prod';

export default function SidePathPersonnel() {
  return ((): TsidePathConfig => {
    const path = '/personnel';

    return {
      path,
      list: [
        {
          label: '班表',
          path: path + '/shift',
          erpFeature: isInProd ? [] : 'allPass',
        },
        {
          label: '請假模組',
          path: path + '/takeLeave',
          erpFeature: isInProd ? [] : 'allPass',
        },
        {
          label: '打卡資料匯入',
          path: path + '/checkIn',
          erpFeature: isInProd ? [] : 'allPass',
        },
        {
          label: '費用管理',
          path: path + '/feeApplication',
          erpFeature: isInProd ? [] : 'allPass',
        },
        {
          label: '薪資結算',
          path: path + '/salary',
          erpFeature: isInProd ? [] : 'allPass',
        },
      ],
    };
  })();
}

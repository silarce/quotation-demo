import { devPass, TsidePathConfig } from '../type';

export default function SidePathPersonnel() {
  return ((): TsidePathConfig => {
    const path = '/personnel';

    return {
      path,
      list: [
        {
          label: '班表',
          path: path + '/shift',
          erpFeature: devPass,
        },
        {
          label: '請假模組',
          path: path + '/takeLeave',
          erpFeature: devPass,
        },
        {
          label: '打卡資料匯入',
          path: path + '/checkIn',
          erpFeature: devPass,
        },
      ],
    };
  })();
}

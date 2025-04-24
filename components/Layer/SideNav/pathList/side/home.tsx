import { TsidePathConfig } from '../type';

export default function SidePathHome() {
  return ((): TsidePathConfig => {
    const path = '/home';

    return {
      path,
      list: [
        {
          label: '日報表',
          erpFeature: 'allPass',
          list: [
            {
              label: '我的日報表',
              path: path + '/dailyReport',
              query: { isMine: 'true' },
              erpFeature: 'allPass',
            },
            {
              label: '審核日報表',
              path: path + '/dailyReport',
              query: { isMine: 'false' },
              erpFeature: 'allPass',
            },
            {
              label: '報表',
              path: path + '/monthReport',
              erpFeature: 'allPass',
              otherPermissions: {
                grade: 14,
              },
              exception: {
                idNumber: ['EM-10902-01', 'EM-11404-06'], // 會計與不知道是誰的帳號(只在正式環境中)
              },
            },
          ],
        },
      ],
    };
  })();
}

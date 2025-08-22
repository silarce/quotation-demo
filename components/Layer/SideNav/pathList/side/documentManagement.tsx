import { TsidePathConfig } from '../type';

const isInProd = process.env.NEXT_PUBLIC_NODE_ENV === 'prod';

export default function SidePathDocumentManagement() {
  const path = '/documentManagement';

  const config: TsidePathConfig = {
    path,
    list: [
      {
        label: '審核管理',
        erpFeature: 'allPass',
        list: [
          {
            label: '審核清單',
            path: path + '/reviewList',
            erpFeature: 'allPass',
          },
          {
            label: '自訂審核',
            path: path + '/flowList',
            erpFeature: 'allPass',
          },
          {
            label: '審核列表',
            path: path + '/approval',
            erpFeature: isInProd ? [] : 'allPass',
          },
        ],
      },
    ],
  };

  return config;
}

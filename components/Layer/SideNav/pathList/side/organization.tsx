import { devPass, TsidePathConfig } from '../type';

const isInProd = process.env.NEXT_PUBLIC_NODE_ENV === 'prod';

export default function SidePathPersonnel() {
  return ((): TsidePathConfig => {
    const path = '/organization';

    return {
      path,
      list: [
        {
          label: '全員工資料維護',
          path: path + '/company',
          erpFeature: isInProd ? [] : 'allPass',
        },
        {
          label: '單公司資料維護',
          path: path + '/editcompany',
          erpFeature: isInProd ? [] : 'allPass',
        },
        {
          label: '部門組織維護',
          path: path + '/department',
          erpFeature: isInProd ? [] : 'allPass',
        },
        {
          label: '員工資料維護',
          path: path + '/employee',
          erpFeature: isInProd ? [] : 'allPass',
        },
        {
          label: '系統管理',
          erpFeature: isInProd ? [] : 'allPass',
          list: [
            {
              label: '使用者維護',
              path: path + '/system/users',
              erpFeature: isInProd ? [] : 'allPass',
            },
            {
              label: '系統角色維護',
              path: path + '/system/roleManagement',
              erpFeature: isInProd ? [] : 'allPass',
            },
          ],
        },
      ],
    };
  })();
}

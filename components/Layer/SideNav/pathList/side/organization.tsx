import { devPass, TsidePathConfig } from '../type';

export default function SidePathPersonnel() {
  return ((): TsidePathConfig => {
    const path = '/organization';

    return {
      path,
      list: [
        {
          label: '全員工資料維護',
          path: path + '/company',
          erpFeature: devPass,
        },
        {
          label: '單公司資料維護',
          path: path + '/editcompany',
          erpFeature: devPass,
        },
        {
          label: '部門組織維護',
          path: path + '/department',
          erpFeature: devPass,
        },
        {
          label: '員工資料維護',
          path: path + '/employee',
          erpFeature: devPass,
        },
        {
          label: '系統管理',
          erpFeature: 'allPass',
          list: [
            {
              label: '使用這維護',
              path: path + '/system/users',
              erpFeature: 'allPass',
            },
            {
              label: '系統角色維護',
              path: path + '/system/roleManagement',
              erpFeature: 'allPass',
            },
          ],
        },
      ],
    };
  })();
}

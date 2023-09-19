import { useContext } from 'react';
import _ from 'lodash';

import { LayerCtx } from 'components/Layer/Layer';

type TarrItem = {
  label: string;
  href: string;
};

export const useHrManageLinkArr = () => {
  const { userErpFeature, userInfo } = useContext(LayerCtx);

  const idNumber = userInfo.employee?.idNumber;
  const gradeArr = userInfo.employee?.jobs.map((job) => {
    return job.grade;
  });
  const heightGrade = _.max(gradeArr) || 0;

  const dailyReporterReviewerSetting = {
    label: '日報表審核設定',
    href: '/setting/hrManage/dailyReporterSetting',
  };

  let arr: TarrItem[] = [];

  const arr1 = [
    {
      label: 'ERP操作權限',
      href: '/setting/hrManage/erpCtrlPermissions',
    },
    {
      label: 'ERP功能權限',
      href: '/setting/hrManage/erpFuncPermissions',
    },
    {
      label: '人事權限管理',
      href: '/setting/hrManage',
    },
  ];

  const isHr = userErpFeature.some((feat) => {
    return feat.name === '人事權限建立';
  });

  if (isHr) {
    arr = arr1;
  }

  //
  if (heightGrade >= 14) {
    arr.push(dailyReporterReviewerSetting);
  }

  if (
    idNumber === 'EM-10902-01' || // 會計的帳號
    idNumber === 'EM-09701-01' // 總務的帳號
  ) {
    arr.push(dailyReporterReviewerSetting);
  }
  //

  return arr;
};

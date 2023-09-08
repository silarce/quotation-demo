import _ from 'lodash';

import { TemployeeDto } from 'js/api/api_employee';

/** 將員工列表變成可以被SetReportEmpModal使用的樣子*/
const formatRiewerPickArr = ({
  dailyReports_ReportersArr,
  employeeArr,
}: {
  dailyReports_ReportersArr: TemployeeDto[];
  employeeArr: TemployeeDto[] | undefined;
}) => {
  if (!dailyReports_ReportersArr || !employeeArr) {
    return [];
  }

  const result = employeeArr.map((item) => {
    const match = dailyReports_ReportersArr.find((x) => x.id === item.id);
    const shouldReport = match ? true : false;
    const theJobs = (() => {
      if (item.jobs) {
        return _.sortBy(item.jobs, 'grade');
      } else {
        return [];
      }
    })();

    const obj = {
      id: item.id,
      chName: item.chName,
      idNumber: item.idNumber,
      job: theJobs[0]?.name ?? '',
      grade: theJobs[0]?.grade ?? '',
      shouldReport,
      isHaveUser: !!item.user,
    };

    return obj;
  });

  return result;
};

export { formatRiewerPickArr };

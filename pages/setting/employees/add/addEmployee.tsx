import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

import _ from 'lodash';

import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
import EditEmployee from 'components/page/setting/employees/editEmployee';

// global gear
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import { setRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';

// api
import { TemployeeDto, apiPostEmployee } from 'js/api/api_employee';
import { Tparams_jobs, useDepartments_jobs } from 'js/api/api_department';

// hook
import { useClassEmployee } from 'hooks/department-job-Employee/useEmployee';

// tool
import { jobsOptionsCreator } from 'js/tools/selectOption/jobsOptionsCreator';

// =====================================================
const departmentParams: Tparams_jobs = {
  order: 'ASC',
  page: 1,
  pageSize: 999,
  populate: ['jobs'],
};

// 防抖
let timeoutId: NodeJS.Timeout;

// =====================================================
export default function AddEmployee() {
  const router = useRouter();

  // ------------------------------------------------------
  const { data: departmentsDataWithMeta, update: updateDepartmentsData } = useDepartments_jobs(departmentParams);
  const departmentsData = departmentsDataWithMeta?.data;

  useEffect(() => {
    (async () => {
      await updateDepartmentsData();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // ------------------------------------------------------
  const classEmployee = useClassEmployee();

  const departmentJobOptionGroup = useMemo(() => {
    if (!departmentsData) {
      return undefined;
    }

    return jobsOptionsCreator(departmentsData);
  }, [departmentsData]);

  // =======================================================
  const panelList: TpanelList = [
    {
      type: 'redButton',
      label: '上傳',
      onClick: async () => {
        if (!classEmployee) {
          return;
        }

        if (!classEmployee.startDate) {
          return myAlert.warning({ title: '請輸入到職日' });
        }

        try {
          setRootLoading(true);
          const res = (await apiPostEmployee(classEmployee.postBody)) as TemployeeDto;
          router.push({
            pathname: `/setting/employees`,
          });
          myAlert.success({ title: '新增人員完成' });
        } catch (error) {
          const err = error as Error;
          const title = '新增使用者失敗';
          myAlert.err({ title, content: err.message });
        } finally {
          setRootLoading(false);
        }
      },
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        router.back();
      },
    },
  ];

  // =====================================================
  return (
    <SubLayer>
      <PageHeader02 tag="人員資料" panelList={panelList} />
      <div>
        {classEmployee && departmentJobOptionGroup && (
          <EditEmployee
            classEmployee={classEmployee}
            departmentJobOptionGroup={departmentJobOptionGroup}
            // check={check}
          />
        )}
      </div>
    </SubLayer>
  );
} // AddEmployee

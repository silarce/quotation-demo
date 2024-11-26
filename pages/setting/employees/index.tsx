import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// components
import EmployeeList from 'components/page/setting/employees/employeeList';

// antd
import { Pagination } from 'antd';

// global gear
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// api
import { useEmployee, Tparams } from 'js/api/api_employee';

// css
import style from './employees.module.scss';

// ==================================================

interface Tquery {
  keyWord?: string;
  page?: `${number}`;
}

// ==================================================

export default function Employees() {
  const router = useRouter();
  const query = router.query as Tquery;
  const { keyWord, page = '1' } = query;

  const [isLoading, setIsLoading] = useState(false);

  // ====================================================

  const params = useMemo(() => {
    const params: Tparams = {
      order: 'ASC',
      page: Number(page),
      pageSize: 12,
      sort: 'idNumber',
      filter: {
        $or: {
          idNumber: {
            $contains: keyWord,
          },
          chName: {
            $contains: keyWord,
          },
        },
      },
      populate: ['jobs.department'],
    };

    return params;
  }, [query]);

  const { data, update } = useEmployee(params);
  const employeeList = data?.data || [];
  const meta = data?.meta;

  // ====================================================
  const setPage = (page: number) => {
    router.replace({
      query: {
        ...query,
        page,
      },
    });
  };

  // =========================================================
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await update();
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // ====================================================\

  const panelList: TpanelList = [
    {
      type: 'inputSearch',
      placeholder: '編號/模糊姓名',
      onClick: (v) => {
        router.replace({
          query: {
            ...query,
            keyWord: v,
            page: 1,
          },
        });
      },
      defaultValue: keyWord,
    },
    {
      type: 'myButton',
      label: '新增員工資料',
      onClick: () => {
        if (isLoading) {
          return;
        }

        router.push(`/setting/employees/add/addEmployee`);
      },
    },
  ];

  // ====================================================
  return (
    <SubLayer>
      <PageHeader02 tag="人員資料" panelList={panelList} />
      <div className={style.body}>
        <EmployeeList employeeList={employeeList} toUpdate={update} isLoading={isLoading} />
        <div className={style.paginationBox}>
          <Pagination
            current={meta?.page ?? 1}
            total={meta?.itemCount ?? 0}
            pageSize={meta?.pageSize ?? 0}
            onChange={setPage}
            showSizeChanger={false}
          />
        </div>
      </div>
    </SubLayer>
  );
}

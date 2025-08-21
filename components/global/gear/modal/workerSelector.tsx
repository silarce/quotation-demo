import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';
import _ from 'lodash';

// global gear
import SelectorShell, { TsearcbBarProps } from './selectorShell';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import myAlert, { ModalInfo } from 'components/global/gear/modal/simpleModal/alertModals';
import LoadingCoverWrapper01 from '../loadingCover/loadingCoverWrapper01';

// css
import scss from './employeeSelector.module.scss';

// type
import { Tparams } from 'js/api/dtoTypes';

// api
import { useApiGetDailyReportsWorkers, TdailyReportWokerDto } from 'js/api/api_dailyReport';

import { useRwd } from 'hooks/globalState/useRwd';

export default function WorkerSelector({
  showModal,
  onConfirm,
  onCancel,
  label,
  tip,
  selLimit,
}: {
  showModal: boolean;
  onConfirm: (v: TdailyReportWokerDto[]) => void;
  onCancel: () => void;
  label?: string;
  tip?: React.ReactNode;
  selLimit?: 1;
}) {
  const { rwd1023 } = useRwd();
  const [isLoading, setIsLoading] = useState(false);

  // 被選的資料
  const [selEmployeeArr, setSelEmployeeArr] = useState<TdailyReportWokerDto[]>([]);

  const [searchValue, setSearchValue] = useState<{
    department: string | undefined;
    keyword: string | undefined;
    grade: string | undefined;
  }>();

  const [pageObj, setPageObj] = useState({ page: -1 });
  const page = pageObj.page;

  const params: Tparams = (() => {
    return {
      page: page,
      pageSize: 20,
      populate: ['jobs'],
      sort: 'idNumber',
      filter: {
        $or: {
          idNumber: { $eq: searchValue?.keyword },
          chName: { $contains: searchValue?.keyword },
          enName: { $contains: searchValue?.keyword },
          'jobs.name': { $eq: searchValue?.keyword },
        },
        'jobs.grade': { $eq: searchValue?.grade },
        // get /daily-reports/workers 所以大概也不能過濾department
        // 'jobs.department.name': { $eq: searchValue.department },
      },
    };
  })();

  const { workers, meta, setRes, updateWorkers, updateWorkers_infinite } = useApiGetDailyReportsWorkers(params);
  const workerArr = workers || [];

  const [viewRef, inView] = useInView();

  useEffect(() => {
    if (!showModal) {
      return;
    }

    if (!inView) {
      return;
    }

    if (!meta?.hasNextPage) {
      return;
    }

    const newPageObj = { ...pageObj, page: pageObj.page + 1 };
    setPageObj(newPageObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    if (!showModal) {
      const newPageObj = { ...pageObj, page: -1 };
      setPageObj(newPageObj);
      setRes(undefined);
      setSearchValue(undefined);

      return;
    }

    const newPageObj = { ...pageObj, page: 1 };
    setPageObj(newPageObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, showModal]);

  useEffect(() => {
    if (page === -1) {
      return;
    }

    if (page === 1) {
      setRes(undefined);

      (async () => {
        try {
          setIsLoading(true);
          await updateWorkers();
        } catch (error) {
          myAlert.err({ title: '取得人員資料失敗' });
        }

        setIsLoading(false);
      })();
    } else {
      (async () => {
        try {
          await updateWorkers_infinite();
        } catch (error) {
          myAlert.err({ title: '取得人員資料失敗' });
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageObj]);

  // ==================================================

  const onClick = (newEmp: TdailyReportWokerDto) => {
    const newArr = [...selEmployeeArr];

    if (selLimit === 1) {
      newArr[0] = newEmp;
      setSelEmployeeArr(newArr);

      return;
    }

    const theIndex = newArr.findIndex((emp) => emp.id === newEmp.id);

    if (theIndex > -1) {
      newArr.splice(theIndex, 1);
    } else {
      newArr.push(newEmp);
    }

    setSelEmployeeArr(newArr);
  };

  const theOnConfirm = () => {
    if (!selEmployeeArr) {
      return ModalInfo('請選擇公司');
    }

    onConfirm(selEmployeeArr);
    theOnCancel();
  };

  const theOnCancel = () => {
    onCancel();
    setSelEmployeeArr([]);
  };

  // ==================================================
  // const { data: departmentData, update: update_department } = useDepartments();

  // useEffect(() => {
  //   update_department();
  // }, []);

  // const optionArr = useMemo(() => {
  //   if (!departmentData) {
  //     return [];
  //   }

  //   const arr = departmentData.data.map((data) => {
  //     return {
  //       value: data.name,
  //       label: data.name,
  //     };
  //   });
  //   arr.unshift({
  //     value: '',
  //     label: '不拘',
  //   });

  //   return arr;
  // }, [departmentData]);

  const inputSelPropsArr: TsearcbBarProps['inputSelPropsArr'] = [
    // /daily-reports/workers 沒有提供department，無法filter department，
    // 所以先拿掉
    // {
    //   selectProps: {
    //     wrapperStyle: { width: '100px' },
    //     props: {
    //       // options: optionArr,
    //       options: [
    //         { value: '管理部', label: '管理部' },
    //         { value: '營業部', label: '營業部' },
    //         { value: '工務部', label: '工務部' },
    //         { value: '會計部', label: '會計部' },
    //         { value: '採購部', label: '採購部' },
    //         { value: '倉管部', label: '倉管部' },
    //         { value: '研發部', label: '研發部' },
    //         { value: '人事部', label: '人事部' },
    //         { value: '廠務部', label: '廠務部' },
    //       ],
    //       placeholder: '選擇部門',
    //     },
    //   },
    // },
    {
      selectProps: {
        wrapperStyle: { width: '100px' },
        props: {
          options: [
            { value: '', label: '不拘' },
            ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => {
              return { value: `${num}`, label: `${num}` };
            }),
          ],
          placeholder: '選擇職等',
          menuPortalTarget: undefined,
        },
      },
    },
    {
      pilarAttr: undefined,
    },
    {
      inputProps: {
        wrapperStyle: { width: '160px' },
        props: {
          placeholder: '搜尋關鍵字',
        },
      },
    },
  ];

  const onSearch = (arr: string[]) => {
    // const department = arr[0] || undefined;
    const grade = arr[0] || undefined;
    const keyword = arr[1] || undefined;

    setSearchValue({
      department: undefined,
      grade,
      keyword,
    });
  };
  // ==================================================

  return (
    <SelectorShell
      label={label ?? ''}
      className={scss.container}
      open={showModal}
      onConfirm={theOnConfirm}
      onCancel={theOnCancel}
      width={rwd1023 ? '80vw' : '800px'}
      tip={tip}
      searcbBarProps={{
        inputSelPropsArr: inputSelPropsArr,
        onClick: onSearch,
      }}
    >
      <LoadingCoverWrapper01 isLoading={isLoading}>
        <div className={scss.listContainer}>
          {workerArr.map((emp, index, arr) => {
            const { idNumber, chName, jobs } = emp;

            const theJob = _.maxBy(jobs, 'grade');
            const { name, grade } = theJob ?? {};

            const isActive = selEmployeeArr.some((selEmp) => selEmp.id === emp.id);

            const theViewRef = (() => {
              if (arr.length - 11 === index) {
                return viewRef;
              }

              return undefined;
            })();

            return (
              <CellWithBar key={index} isActive={isActive} className={scss.rowWrapper}>
                <div className={classNames(scss.row)} onClick={() => onClick(emp)} ref={theViewRef}>
                  <span className={scss.idNumber}>{idNumber}</span>
                  <span>{chName}</span>
                  <span>{name}</span>
                  <span>{grade && `Level ${grade}`}</span>
                </div>
              </CellWithBar>
            );
          })}
        </div>
      </LoadingCoverWrapper01>
    </SelectorShell>
  );
}

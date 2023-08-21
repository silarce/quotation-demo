import { useState, useEffect, useMemo, useContext } from 'react';
import { useInView } from 'react-intersection-observer';
import _ from 'lodash';

// global gear
// import ModalListSelectorWithSearch from 'components/global/gear/modal/modalListSelectorWithSearch';
import SelectorShell, { TsearcbBarProps } from './selectorShell';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import myAlert, { ModalInfo } from 'components/global/gear/modal/simpleModal/alertModals';
import LoadingCoverWrapper01 from '../loadingCover/loadingCoverWrapper01';

// css
import style from './employeeSelector.module.scss';

// type
import { TemployeeDto } from 'js/api/dtoTypes';

// api
import { Tparams, TapiGetEmployeeParams, useEmployee } from 'js/api/api_employee';

import { AppContext } from 'pages/_app';

export type { TemployeeDto };

export default function EmployeeSelector({
  showModal,
  onConfirm,
  onCancel,
  label,
  tip,
  selLimit,
  customParams,
  customFilter,
}: {
  showModal: boolean;
  onConfirm: (v: TemployeeDto[]) => void;
  onCancel: () => void;
  label?: string;
  tip?: React.ReactNode;
  selLimit?: 1;
  customParams?: Tparams;
  customFilter?: Tparams['filter'];
}) {
  const { rwd1023 } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  // 被選的資料
  const [selEmployeeArr, setSelEmployeeArr] = useState<TemployeeDto[]>([]);

  const [searchValue, setSearchValue] = useState<string | undefined>();
  const [pageObj, setPageObj] = useState({ page: -1 });
  const page = pageObj.page;

  const params: Tparams = (() => {
    const allNum = /^\d+$/.test(searchValue ?? 'n');
    const grade = allNum ? searchValue : undefined;

    return {
      page: page,
      pageSize: 20,
      populate: ['jobs.department'],
      sort: 'idNumber',
      filter: {
        $or: {
          idNumber: {
            $contains: searchValue,
          },
          chName: { $contains: searchValue },
          'jobs.name': { $contains: searchValue },
          'jobs.grade': { $eq: grade },
        },
        ...customFilter,
      },
      ...customParams,
    };
  })();

  const { data, setData, update, update_infinite } = useEmployee(params);
  const employeeArr = data?.data || [];
  const meta = data?.meta;

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
      setData(undefined);
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
      setData(undefined);

      (async () => {
        try {
          setIsLoading(true);
          await update();
        } catch (error) {
          myAlert.err({ title: '取得人員資料失敗' });
        }

        setIsLoading(false);
      })();
    } else {
      (async () => {
        try {
          await update_infinite();
        } catch (error) {
          myAlert.err({ title: '取得人員資料失敗' });
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageObj]);

  // ==================================================

  const onClick = (newEmp: TemployeeDto) => {
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

  const onSearch = (v: string[]) => {
    setSearchValue(v[0]);
  };

  const inputSelPropsArr: TsearcbBarProps['inputSelPropsArr'] = [
    {
      inputProps: {
        wrapperClassName: '',
        wrapperStyle: { width: '160px' },
        props: {
          placeholder: '搜尋關鍵字',
        },
      },
    },
  ];

  // ==================================================

  return (
    <SelectorShell
      label={label ?? ''}
      visible={showModal}
      onConfirm={theOnConfirm}
      onCancel={theOnCancel}
      // onSearch={onSearch}
      width={rwd1023 ? '80vw' : '800px'}
      className={style.container}
      tip={tip}
      searcbBarProps={{
        inputSelPropsArr: inputSelPropsArr,
        onClick: onSearch,
      }}
    >
      <LoadingCoverWrapper01 isLoading={isLoading}>
        <div className={style.listContainer}>
          {employeeArr.map((emp, index, arr) => {
            const { idNumber, chName, jobs } = emp;
            const { name, grade, department } = jobs?.[0] ?? {};

            const isActive = selEmployeeArr.some((selEmp) => selEmp.id === emp.id);

            const theViewRef = (() => {
              if (arr.length - 11 === index) {
                return viewRef;
              }

              return undefined;
            })();

            return (
              <CellWithBar key={index} isActive={isActive}>
                <div className={style.row} onClick={() => onClick(emp)} ref={theViewRef}>
                  <span className={style.idNumber}>{idNumber}</span>
                  <span>{chName}</span>
                  <span>{name ? `${department?.name} / ${name}` : ''}</span>
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

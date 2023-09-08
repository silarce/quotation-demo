import { useState, useEffect, useMemo, useContext } from 'react';
import { useInView } from 'react-intersection-observer';

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
import { Tparams, useEmployee_lab } from 'js/api/api_employee';
import { useDepartments } from 'js/api/api_department';

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

  // 被選的資料
  const [selEmployeeArr, setSelEmployeeArr] = useState<TemployeeDto[]>([]);

  const [searchValue, setSearchValue] = useState<string[]>([]);

  const params: Tparams = (() => {
    const allNum = /^\d+$/.test(searchValue[1] ?? 'n');
    const grade = allNum ? searchValue[1] : undefined;

    return {
      pageSize: 20,
      populate: ['jobs.department'],
      sort: 'idNumber',
      filter: {
        $or: {
          idNumber: {
            $contains: searchValue[1],
          },
          chName: { $contains: searchValue[1] },
          'jobs.name': { $contains: searchValue[1] },
          'jobs.grade': { $eq: grade },
        },
        'jobs.department.name': { $contains: searchValue[0] },

        ...customFilter,
      },
      ...customParams,
    };
  })();

  const { dataArr, viewRef_bottom, isLoadingPage1, reset } = useEmployee_lab({ customParams: params });

  //
  const { data: departmentData, update: update_department } = useDepartments();

  useEffect(() => {
    if (!showModal) {
      return;
    }

    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, showModal]);

  // ==================================================
  useEffect(() => {
    if (!showModal) {
      return;
    }

    update_department();
  }, []);

  const optionArr = useMemo(() => {
    if (!departmentData) {
      return [];
    }

    const arr = departmentData.data.map((data) => {
      return {
        value: data.name,
        label: data.name,
      };
    });
    arr.unshift({
      value: '',
      label: '不拘',
    });

    return arr;
  }, [departmentData]);

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
    setSearchValue(v);
  };

  const inputSelPropsArr: TsearcbBarProps['inputSelPropsArr'] = [
    {
      selectProps: {
        wrapperStyle: { width: '100px' },
        props: {
          options: optionArr,
          placeholder: '選擇部門',
        },
      },
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
      <LoadingCoverWrapper01 isLoading={isLoadingPage1}>
        <div className={style.listContainer}>
          {dataArr.map((emp, index, arr) => {
            const { idNumber, chName, jobs } = emp;
            const { name, grade, department } = jobs?.[0] ?? {};

            const isActive = selEmployeeArr.some((selEmp) => selEmp.id === emp.id);

            const theViewRef = (() => {
              if (arr.length - 11 === index) {
                return viewRef_bottom;
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

import { useState, useEffect, useMemo, useContext } from 'react';
import classNames from 'classnames';

// global gear
import SelectorShell, { TsearcbBarProps } from './selectorShell';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import { ModalInfo } from 'components/global/gear/modal/simpleModal/alertModals';
import LoadingCoverWrapper01 from '../loadingCover/loadingCoverWrapper01';

// css
import scss from './employeeSelector.module.scss';

// type
import { TemployeeDto } from 'js/api/dtoTypes';

// api
import { Tparams, useEmployee_infinite } from 'js/api/api_employee';
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
  customPopulate,
  defaultEmpArr,
  exceptEmpArr,
  isCancelOnConfirm = true,
  exceptEmpCheck,
}: {
  showModal: boolean;
  onConfirm: (v: TemployeeDto[]) => void;
  onCancel: () => void;
  label?: string;
  tip?: React.ReactNode;
  selLimit?: 1;
  customParams?: Tparams;
  customFilter?: Tparams['filter'];
  customPopulate?: Tparams['populate'];
  defaultEmpArr?: TemployeeDto[];
  exceptEmpArr?: { id: string }[];
  isCancelOnConfirm?: boolean;
  exceptEmpCheck?: (emp: TemployeeDto) => boolean;
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
      populate: ['jobs.department', ...(customPopulate ?? [])],
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

  const { dataArr, viewRef_bottom, isLoadingPage1, reset } = useEmployee_infinite({ customParams: params });

  //
  const { data: departmentData, update: update_department } = useDepartments();

  useEffect(() => {
    if (!showModal) {
      return;
    }

    // setSelEmployeeArr([]);
    reset();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, showModal]);

  useEffect(() => {
    if (!showModal) {
      setSelEmployeeArr([]);
      setSearchValue([]);

      return;
    }

    if (defaultEmpArr) {
      setSelEmployeeArr(defaultEmpArr);
    }

    update_department();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

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
      return ModalInfo('請選擇人員');
    }

    onConfirm(selEmployeeArr);

    if (isCancelOnConfirm) {
      theOnCancel();
    }
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
        wrapperStyle: { width: '120px' },
        props: {
          options: optionArr,
          placeholder: '選擇部門',
          menuPortalTarget: undefined,
          isLoading: !departmentData,
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
      className={scss.container}
      tip={tip}
      searcbBarProps={{
        inputSelPropsArr: inputSelPropsArr,
        onClick: onSearch,
      }}
    >
      <LoadingCoverWrapper01 isLoading={isLoadingPage1}>
        <div className={scss.listContainer}>
          <RowArr
            empArr={selEmployeeArr ?? []}
            selEmployeeArr={selEmployeeArr}
            exceptEmpArr={exceptEmpArr}
            onClick={onClick}
            exceptEmpCheck={exceptEmpCheck}
          />

          {selEmployeeArr.length !== 0 && <div className={scss.divider} />}

          <RowArr
            empArr={dataArr}
            selEmployeeArr={selEmployeeArr}
            viewRef_bottom={viewRef_bottom}
            exceptEmpArr={exceptEmpArr}
            onClick={onClick}
            // skipArr={defaultEmpArr}
            exceptEmpCheck={exceptEmpCheck}
          />
          {/*  */}
        </div>
      </LoadingCoverWrapper01>
    </SelectorShell>
  );
}

// =========================================================

const RowArr = ({
  empArr,
  selEmployeeArr,
  // skipArr,
  viewRef_bottom,
  exceptEmpArr,
  onClick,
  exceptEmpCheck,
}: {
  empArr: TemployeeDto[];
  selEmployeeArr: TemployeeDto[];
  // skipArr?: TemployeeDto[];
  onClick: (v: TemployeeDto) => void;
  exceptEmpArr?: { id: string }[];
  viewRef_bottom?: (node?: Element | null | undefined) => void;
  exceptEmpCheck: ((emp: TemployeeDto) => boolean) | undefined;
}) => {
  return (
    <>
      {empArr.map((emp, index, arr) => {
        const { idNumber, chName, jobs } = emp;
        const { name, grade, department } = jobs?.[0] ?? {};

        const theViewRef = (() => {
          if (arr.length - 11 === index) {
            return viewRef_bottom;
          }

          return undefined;
        })();

        const isActive = selEmployeeArr.some((selEmp) => selEmp.id === emp.id);
        let isExcept = exceptEmpArr?.some((exceptEmp) => exceptEmp.id === emp.id);

        if (!isExcept && exceptEmpCheck) {
          isExcept = exceptEmpCheck(emp);
        }
        // const isSkinp = skipArr?.some((selEmp) => selEmp.id === emp.id);

        const theOnClick = isExcept ? undefined : () => onClick(emp);

        // if (isSkinp) {
        //   return <div key={index} className="skip" ref={theViewRef}></div>;
        // }

        return (
          <CellWithBar key={index} isActive={isActive}>
            <div className={classNames(scss.row, isExcept && scss.except)} onClick={theOnClick} ref={theViewRef}>
              <span className={scss.idNumber}>{idNumber}</span>
              <span>{chName}</span>
              <span>{name ? `${department?.name} / ${name}` : ''}</span>
              <span>{grade && `Level ${grade}`}</span>
            </div>
          </CellWithBar>
        );
      })}
    </>
  );
};

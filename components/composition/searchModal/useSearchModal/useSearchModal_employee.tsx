import { useEffect, useMemo } from 'react';

import type { TuseSearchModal, Tstate_filter, Tconfig_filter, Tconfig, TmodalData } from '../types';

import { useEmployee_infinite_2, TemployeeDto } from 'js/api/api_employee';
import { useDepartments } from 'js/api/api_department';

import type { Tparams } from 'js/api/dtoTypes';

import { useFilter } from '../useFilter';
import { useInputSelProps } from '../useInputSelProps';

import SearchModal, { Tprops_refine } from '..';

// =====================================================================================

// 由五個部分組成
// useConfig_filter: 設定左側filter的欄位
// useConfig_data: 設定table的欄位
// useFilter: 處理filter的狀態
// useInputSelProps: 將config_filter與狀態送入，建立inputSelProps
// useData: 將filter送進去，取得資料

const useSearchModal_employee = (): TuseSearchModal<TemployeeDto> => {
  const config_filter = useConfig_filter();
  const { dataConfig, dataKeyArr } = useConfig_data();

  const { state, setState, clearState, filter, confirmFilter } = useFilter({ config_filter });
  const inputSelPropsArr = useInputSelProps({ config_filter, state, setState });
  const { dataArr, viewRef, isLoading, qty } = useData(filter);

  return {
    inputSelPropsArr,
    clearFilter: clearState,
    confirmFilter,
    //
    dataArr,
    qty,
    viewRef,
    isLoading,
    dataConfig,
    dataKeyArr,
  };
  //
};

// =============================================================================
// 將filter送進來，給取得資料的api hook
// useData(或是要叫其他名字也無所謂)，的輸入與細節怎樣都無所謂，但必須輸出TmodalData
const useData = (state_filter: Tstate_filter | undefined): TmodalData<TemployeeDto> => {
  const params: Tparams = useMemo(() => {
    const filter = state_filter && {
      idNumber: {
        $contains: state_filter.idNumber,
      },
      chName: {
        $contains: state_filter.chName,
      },
      'jobs.name': {
        $contains: state_filter.jobName,
      },
      'jobs.grade': {
        $contains: state_filter.grade,
      },
      'jobs.department.id': {
        $contains: state_filter.department,
      },
    };

    return {
      pageSize: 20,
      sort: 'idNumber',
      order: 'ASC',
      filter,
      populate: ['jobs.department'],
    };
  }, [state_filter]);

  const { dataArr, viewRef_bottom, isLoadingPage1, reset, meta } = useEmployee_infinite_2({
    customParams: params,
  });

  useEffect(() => {
    reset();
  }, [params]);

  return {
    dataArr,
    qty: meta?.itemCount || '',
    viewRef: viewRef_bottom,
    isLoading: isLoadingPage1,
  };
};

// =============================================================================

const useConfig_data = () => {
  const dataConfig = useMemo(() => {
    const config: Tconfig<TemployeeDto> = {
      indexNumber: {
        label: '',
        style: {
          width: '30px',
        },
        reducer: (_, { index }) => {
          return index + 1;
        },
      },
      idNumber: {
        label: '編號',
        style: {
          width: '120px',
        },
      },
      chName: {
        label: '姓名',
        style: {
          width: '100px',
          justifyContent: 'flex-start',
        },
      },
      jobs: {
        label: '職等/職稱',
        style: {
          width: '300px',
          justifyContent: 'flex-start',
        },
        reducer: (employee) => {
          return (
            <div>
              {(employee?.jobs ?? []).map((job, index) => {
                const { department, grade, name } = job;
                const departmentName = department?.name ?? '';

                return (
                  <div key={index} className="flex justify-start gap-2">
                    <span className="w-20">{departmentName}</span>
                    <span className="w-20 inline-block ">
                      Level
                      <span className="w-7 inline-block text-right">{grade}</span>
                    </span>
                    <span>{name}</span>
                  </div>
                );
              })}
            </div>
          );
        },
      },
    };

    return config;
  }, []);

  const dataKeyArr: string[] = ['indexNumber', 'idNumber', 'chName', 'jobs'];

  return { dataConfig, dataKeyArr };
};

// =============================================================================

// 要做i18n的處理，因此設定不能抽出hook
const useConfig_filter = () => {
  const { update, optionArr } = useDepartments();

  useEffect(() => {
    update();
  }, []);

  return useMemo(() => {
    const config_filter: Tconfig_filter = [
      {
        caption: '編號',
        key: 'idNumber',
        type: 'input',
      },
      {
        caption: '姓名',
        key: 'chName',
        type: 'input',
      },
      {
        caption: '職等',
        key: 'grade',
        type: 'input',
      },
      {
        caption: '職稱',
        key: 'jobName',
        type: 'input',
      },
      {
        caption: '部門',
        key: 'department',
        type: 'select',
        selectOptions: optionArr,
      },
    ];

    return config_filter;
  }, [optionArr]);
};

// ============================================================================

const SearchModal_employee = (props: Tprops_refine<TemployeeDto>) => {
  return <SearchModal {...props} useSearchModal={useSearchModal_employee} />;
};

// ============================================================================

export { useSearchModal_employee, SearchModal_employee };
export type { TemployeeDto };

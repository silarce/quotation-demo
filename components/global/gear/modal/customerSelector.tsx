import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import _ from 'lodash';

// global gear
// import ModalListSelectorWithSearch from 'components/global/gear/modal/modalListSelectorWithSearch';
import SelectorShell, { TsearcbBarProps } from './selectorShell';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import myAlert, { ModalInfo } from 'components/global/gear/modal/simpleModal/alertModals';
import LoadingCoverWrapper01 from '../loadingCover/loadingCoverWrapper01';

import { optionsCreator_customerType } from 'js/utils/options/options';

// css
import scss from './customerSelector.module.scss';

// api
import {
  TcustomerDto_TC,
  TcustomerDto,
  TapiGetCustomersParams,
  useCustomers,
  useGetCustomers_infinite,
} from 'js/api/api_customer';
// ====================================================================

const customerTypeArr = optionsCreator_customerType({ emptyOption: true });

// ====================================================================
export default function CustomerSelector({
  showModal,
  onConfirm,
  onCancel,
  label,
  tip,
  selLimit,
}: {
  showModal: boolean;
  onConfirm: (v: TcustomerDto_TC[]) => void;
  onCancel: () => void;
  label?: string;
  tip?: React.ReactNode;
  selLimit?: 1;
}) {
  const [isLoading, setIsLoading] = useState(false);

  // 被選的資料
  const [selEmployeeArr, setSelEmployeeArr] = useState<TcustomerDto_TC[]>([]);

  const [searchValue, setSearchValue] = useState<string[]>([]);

  const params: TapiGetCustomersParams = (() => {
    return {
      pageSize: 20,
      populate: ['contacts', 'types'],
      sort: 'customerNumber',
      filter: {
        $or: {
          customerNumber: { $contains: searchValue[1] },
          name: { $contains: searchValue[1] },
        },
        'types.name': { $contains: searchValue[0] },
      },
    };
  })();

  const { dataArr, viewRef_bottom, isLoadingPage1, reset } = useGetCustomers_infinite({ customParams: params });

  useEffect(() => {
    if (!showModal) {
      setSelEmployeeArr([]);

      return;
    }

    reset();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, showModal]);

  useEffect(() => {
    if (!showModal) {
      setSearchValue([]);

      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  // ==================================================

  const onClick = (newEmp: TcustomerDto_TC) => {
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
    if (!selEmployeeArr || selEmployeeArr.length === 0) {
      return ModalInfo('請選擇客戶');
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

  // ==================================================
  const inputSelPropsArr: TsearcbBarProps['inputSelPropsArr'] = [
    {
      selectProps: {
        wrapperStyle: { width: '100px' },
        props: {
          options: customerTypeArr,
          menuPortalTarget: undefined,
        },
      },
    },
    {
      pilarAttr: {},
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
      width={'800'}
      className={scss.container}
      tip={tip}
      searcbBarProps={{
        inputSelPropsArr: inputSelPropsArr,
        onClick: onSearch,
      }}
    >
      <LoadingCoverWrapper01 isLoading={isLoadingPage1}>
        <div className={scss.listContainer}>
          {dataArr?.map((customer, index, arr) => {
            const { customerNumber, name } = customer;

            const isActive = selEmployeeArr.some((selEmp) => selEmp.id === customer.id);

            const theViewRef = (() => {
              if (arr.length - 11 === index) {
                return viewRef_bottom;
              }

              return undefined;
            })();

            return (
              <CellWithBar key={index} isActive={isActive} className={scss.rowWrapper}>
                <div className={scss.listItem} onClick={() => onClick(customer as TcustomerDto_TC)} ref={theViewRef}>
                  <span>{customerNumber}</span>
                  <span>{name}</span>
                </div>
              </CellWithBar>
            );
          })}
        </div>
      </LoadingCoverWrapper01>
    </SelectorShell>
  );
}

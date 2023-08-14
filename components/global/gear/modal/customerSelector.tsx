import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import _ from 'lodash';

// global gear
import ModalListSelectorWithSearch from 'components/global/gear/modal/modalListSelectorWithSearch';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import myAlert, { ModalInfo } from 'components/global/gear/modal/simpleModal/alertModals';
import LoadingCoverWrapper01 from '../loadingCover/loadingCoverWrapper01';

// css
import style from './customerSelector.module.scss';

// api
import { TcustomerDto, TcustomerDto_TC, TapiGetCustomersParams, useCustomers } from 'js/api/api_customer';

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

  const [searchValue, setSearchValue] = useState<string | undefined>();
  const [pageObj, setPageObj] = useState({ page: -1 });
  const page = pageObj.page;

  const params: TapiGetCustomersParams = (() => {
    return {
      page: page,
      pageSize: 20,
      populate: ['contacts', 'types'],
      sort: 'customerNumber',
      filter: {
        $or: {
          customerNumber: { $contains: searchValue },
          name: { $contains: searchValue },
        },
      },
    };
  })();

  const res = useCustomers(params);
  const { meta, setData, update, update_infinite } = res;
  const customerArr = res?.data as TcustomerDto_TC[] | undefined;

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
          myAlert.err({ title: '取得客戶資料失敗' });
        }

        setIsLoading(false);
      })();
    } else {
      (async () => {
        try {
          await update_infinite();
        } catch (error) {
          myAlert.err({ title: '取得客戶資料失敗' });
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageObj]);

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
    if (!selEmployeeArr) {
      return ModalInfo('請選擇客戶');
    }

    onConfirm(selEmployeeArr);
    theOnCancel();
  };

  const theOnCancel = () => {
    onCancel();
    setSelEmployeeArr([]);
  };

  const onSearch = (v: string) => {
    setSearchValue(v);
  };

  // ==================================================

  return (
    <ModalListSelectorWithSearch
      label={label ?? ''}
      visible={showModal}
      onConfirm={theOnConfirm}
      onCancel={theOnCancel}
      onSearch={onSearch}
      width={'800'}
      className={style.container}
      tip={tip}
    >
      <LoadingCoverWrapper01 isLoading={isLoading}>
        <div className={style.listContainer}>
          {customerArr?.map((emp, index, arr) => {
            const { customerNumber, name } = emp;

            const isActive = selEmployeeArr.some((selEmp) => selEmp.id === emp.id);

            const theViewRef = (() => {
              if (arr.length - 11 === index) {
                return viewRef;
              }

              return undefined;
            })();

            return (
              <CellWithBar key={index} isActive={isActive}>
                <div className={`${style.listItem}`} onClick={() => onClick(emp)} ref={theViewRef}>
                  <span>{customerNumber}</span>
                  <span>{name}</span>
                </div>
              </CellWithBar>
            );
          })}
        </div>
      </LoadingCoverWrapper01>
    </ModalListSelectorWithSearch>
  );
}

import { useState, useEffect } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

// global gear
import SelectorShell, { TsearcbBarProps } from './selectorShell';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import myAlert, { ModalInfo } from 'components/global/gear/modal/simpleModal/alertModals';
import LoadingCoverWrapper01 from '../loadingCover/loadingCoverWrapper01';

import scss from './paymentRecordSelector.module.scss';

import { Tparams, TaccountsReceivableInvoiceDto, useGetAccountReceivableIncoices } from 'js/api/api_engineering';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// ==========================================================================

export type { TaccountsReceivableInvoiceDto };

// ==========================================================================
export default function InvoiceSelector({
  accountReceivableId,
  showModal,
  onConfirm,
  onCancel,
  label,
  tip,
  selLimit,
  customParams,
  customFilter,
  customPopulate,
  defaultAccountantArr,
  exceptInvoiceArr,
  isCancelOnConfirm = true,
  exceptInvoiceCheck,
}: {
  accountReceivableId: string | undefined;
  showModal: boolean;
  onConfirm: (v: TaccountsReceivableInvoiceDto[]) => void;
  onCancel: () => void;
  label?: string;
  tip?: React.ReactNode;
  selLimit?: 1;
  customParams?: Tparams;
  customFilter?: Tparams['filter'];
  customPopulate?: Tparams['populate'];
  defaultAccountantArr?: TaccountsReceivableInvoiceDto[];
  exceptInvoiceArr?: { id: string }[];
  isCancelOnConfirm?: boolean;
  exceptInvoiceCheck?: (data: TaccountsReceivableInvoiceDto) => boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  // ------------------------------------------------------------------

  const [searchValue, setSearchValue] = useState<string[]>([]);

  const params: Tparams = {
    pageSize: 9999,
    sort: 'createdAt',
    order: 'ASC',
    filter: {
      $or: {
        '0': {
          invoiceNumber: { $eq: searchValue },
        },
        '1': {
          price: { $eq: isNaN(Number(searchValue)) ? undefined : Number(searchValue) },
        },
        '2': {
          note: { $contains: searchValue },
        },
      },
    },
  };

  const { data: dataArr, update } = useGetAccountReceivableIncoices(accountReceivableId, params);

  // ------------------------------------------------------------------
  // 被選的資料
  const [selDataArr, setSelDataArr] = useState<TaccountsReceivableInvoiceDto[]>([]);

  useEffect(() => {
    if (!showModal) {
      return;
    }

    (async () => {
      try {
        setIsLoading(true);
        await update();
      } catch (error) {
        const err = error as Error;
        myAlert.err({ title: '取得發票列表失敗', content: err.message });
      } finally {
        setIsLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountReceivableId, searchValue, showModal]);

  useEffect(() => {
    if (!showModal) {
      setSelDataArr([]);
      setSearchValue([]);

      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  // ==================================================

  const onClick = (newData: TaccountsReceivableInvoiceDto) => {
    const newArr = [...selDataArr];

    if (selLimit === 1) {
      newArr[0] = newData;
      setSelDataArr(newArr);

      return;
    }

    const theIndex = newArr.findIndex((data) => data.id === newData.id);

    if (theIndex > -1) {
      newArr.splice(theIndex, 1);
    } else {
      newArr.push(newData);
    }

    setSelDataArr(newArr);
  };

  const theOnConfirm = () => {
    if (!selDataArr) {
      return ModalInfo('請選擇收款紀錄');
    }

    onConfirm(selDataArr);

    if (isCancelOnConfirm) {
      theOnCancel();
    }
  };

  const theOnCancel = () => {
    onCancel();
    setSelDataArr([]);
  };

  const onSearch = (v: string[]) => {
    setSearchValue(v);
  };

  const inputSelPropsArr: TsearcbBarProps['inputSelPropsArr'] = [
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
      width={'619px'}
      className={scss.container}
      tip={tip}
      searcbBarProps={{
        inputSelPropsArr: inputSelPropsArr,
        onClick: onSearch,
      }}
      // otherLeft={otherLeft}
    >
      <LoadingCoverWrapper01 isLoading={isLoading}>
        <div className={scss.listContainer}>
          <div className={classNames(scss.thead, scss.row)}>
            <div>
              <span>日期</span>
            </div>
            <div>
              <span>發票號碼</span>
            </div>
            <div>
              <span>金額</span>
            </div>
            <div>
              <span>備註</span>
            </div>
            <div>
              <span>對應期數</span>
            </div>
          </div>
          {/*  */}

          <RowArr
            dataArr={selDataArr}
            selDataArr={selDataArr}
            onClick={onClick}
            // exceptDataArr={exceptAccountantArr}
            // exceptDataCheck={exceptAccountantCheck}
          />

          {selDataArr.length !== 0 && <div className={scss.divider} />}

          <RowArr
            dataArr={dataArr ?? []}
            selDataArr={selDataArr}
            onClick={onClick}
            // viewRef_bottom={viewRef_bottom}
            exceptDataArr={exceptInvoiceArr}
            exceptDataCheck={exceptInvoiceCheck}
          />
        </div>
      </LoadingCoverWrapper01>
    </SelectorShell>
  );
}
// =========================================================

// =========================================================

const RowArr = ({
  dataArr: dataArr,
  selDataArr,
  // skipArr,
  viewRef_bottom,
  exceptDataArr,
  onClick,
  exceptDataCheck,
}: {
  dataArr: TaccountsReceivableInvoiceDto[];
  selDataArr: TaccountsReceivableInvoiceDto[];
  // skipArr?: TemployeeDto[];
  onClick: (v: TaccountsReceivableInvoiceDto) => void;
  exceptDataArr?: { id: string }[];
  viewRef_bottom?: (node?: Element | null | undefined) => void;
  exceptDataCheck?: ((data: TaccountsReceivableInvoiceDto) => boolean) | undefined;
}) => {
  return (
    <>
      {dataArr.map((data, index) => {
        const { invoiceDate, invoiceNumber, price, note } = data;

        const ref = index === dataArr.length - 3 ? viewRef_bottom : undefined;

        const isActive = selDataArr.some((selData) => selData.id === data.id);

        let isExcept = exceptDataArr?.some((exceptEmp) => exceptEmp.id === data.id);

        if (!isExcept && exceptDataCheck) {
          isExcept = exceptDataCheck(data);
        }
        // const isSkinp = skipArr?.some((selEmp) => selEmp.id === emp.id);

        const theOnClick = isExcept ? undefined : () => onClick(data);

        // if (isSkinp) {
        //   return <div key={index} className="skip" ref={theViewRef}></div>;
        // }

        return (
          <CellWithBar key={index} isActive={isActive}>
            <div className={classNames(scss.row, isExcept && scss.except)} onClick={theOnClick} ref={ref}>
              <div>
                <span>{getTaiwanDateStr(invoiceDate)}</span>
              </div>
              <div>
                <span>{invoiceNumber}</span>
              </div>
              <div>
                <span>{price}</span>
              </div>
              <div>
                <span>{note}</span>
              </div>
              <div>
                {/* dataArr要以createdAt排序 */}
                <span>{`第${index + 1}期`}</span>
              </div>
            </div>
          </CellWithBar>
        );
      })}
    </>
  );
};
